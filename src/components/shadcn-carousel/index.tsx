"use client";
/* eslint-disable react/display-name */

import styles from "./index.module.css";
import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cn, toPx } from "@/utils";

type ShadcnCarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: ShadcnCarouselApi) => void;
  gap?: string | number;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  gap: string | number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const ShadcnCarousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      gap = 0,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: ShadcnCarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          gap,
          orientation:
            // keep shadcn logic
            opts?.axis === "y" ? "vertical" : "horizontal",
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(styles.root, className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);

const ShadcnCarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { overflow?: "visible" | "hidden" }
>(({ className, style, overflow = "hidden", ...props }, ref) => {
  const { carouselRef, orientation, gap } = useCarousel();

  return (
    <div ref={carouselRef} style={{ overflow: overflow }}>
      <div
        ref={ref}
        className={cn(styles.content, className)}
        style={
          orientation === "horizontal"
            ? { marginLeft: `-${toPx(gap)}`, ...style }
            : { marginTop: `-${toPx(gap)}`, flexDirection: "column", ...style }
        }
        {...props}
      />
    </div>
  );
});

const ShadcnCarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
  const { orientation, gap } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(styles.item, className)}
      style={
        orientation === "horizontal"
          ? { paddingLeft: toPx(gap), ...style }
          : { paddingTop: toPx(gap), ...style }
      }
      {...props}
    />
  );
});

const useDotButton = (carouselApi: ShadcnCarouselApi) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!carouselApi) return;
      carouselApi.scrollTo(index);
      (carouselApi.plugins().autoplay as any).stop();
    },
    [carouselApi]
  );

  const onInit = React.useCallback(
    (carouselApi: NonNullable<ShadcnCarouselApi>) => {
      setScrollSnaps(carouselApi.scrollSnapList());
    },
    []
  );

  const onSelect = React.useCallback(
    (carouselApi: NonNullable<ShadcnCarouselApi>) => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    },
    []
  );

  React.useEffect(() => {
    if (!carouselApi) return;
    onInit(carouselApi);
    onSelect(carouselApi);
    carouselApi.on("reInit", onInit);
    carouselApi.on("reInit", onSelect);
    carouselApi.on("select", onSelect);
  }, [carouselApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

const usePrevNextButtons = (
  carouselApi: ShadcnCarouselApi
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const onPrevButtonClick = React.useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
  }, [carouselApi]);

  const onNextButtonClick = React.useCallback(() => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
  }, [carouselApi]);

  const onSelect = React.useCallback(
    (carouselApi: NonNullable<ShadcnCarouselApi>) => {
      setPrevBtnDisabled(!carouselApi.canScrollPrev());
      setNextBtnDisabled(!carouselApi.canScrollNext());
    },
    []
  );

  React.useEffect(() => {
    if (!carouselApi) return;

    onSelect(carouselApi);
    carouselApi.on("reInit", onSelect).on("select", onSelect);
  }, [carouselApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

export {
  type ShadcnCarouselApi,
  ShadcnCarousel,
  useDotButton,
  usePrevNextButtons,
  ShadcnCarouselContent,
  ShadcnCarouselItem,
};
