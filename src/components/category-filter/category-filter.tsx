import useContainerDimensions from '@/src/hooks/use-container-dimensions';
import Category from '@/src/types/Category';
import convertToEm from '@/src/utils/css-utils';
import { useEffect, useRef, useState } from 'react';
import styles from './category-filter.module.css';

interface CategoryFilterProps {
  height: string; // css style
  itemWidth: number; // in em
  itemSpacing: number; // in em
}

const CategoryFilter = ({
  height,
  itemWidth,
  itemSpacing,
}: CategoryFilterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [nCategoriesOnScreen, setNCategoriesOnScreen] = useState(0);

  const componentRef = useRef(null);

  // Updates to reflect current filter dimensions
  const { width: actualWidth, height: actualHeight } =
    useContainerDimensions(componentRef);

  // Index that the user has currently paged to
  const [categoryIndex, setCategoryIndex] = useState(0);

  function paginate(i: number) {
    if (categoryIndex + i <= 0) {
      setCategoryIndex(0);
    } else if (categoryIndex + i >= categories.length) {
      // Do nothing, we've reached the end
    } else {
      setCategoryIndex(categoryIndex + i);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetch('api/get-categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
    setIsLoading(false);
  }, []);

  /**
   * Calculate the number of categories that can fit on screen
   */
  useEffect(() => {
    // Nothing to calculate if the container doesn't exist
    if (componentRef.current == null) {
      return;
    }

    // Get the font size, this will be used to convert ems into pixels for width calculations
    const fontSize = parseFloat(
      window
        .getComputedStyle(componentRef.current!)
        .getPropertyValue('font-size'),
    );

    // ~~(x) will floor x
    const n = ~~(actualWidth / ((itemWidth + itemSpacing) * fontSize));

    setNCategoriesOnScreen(n);
  }, [actualWidth, itemWidth, itemSpacing, componentRef]);

  return (
    <ul
      className={styles.categoryFilter}
      style={{ height: height }}
      ref={componentRef}
    >
      {categoryIndex > 0 && (
        <li
          onClick={(e) => {
            e.preventDefault;
            paginate(-nCategoriesOnScreen);
          }}
        >
          <i>Back</i>
        </li>
      )}

      {!isLoading &&
        categories.map(
          (category, index) =>
            index >= categoryIndex &&
            categoryIndex + nCategoriesOnScreen > index && (
              <li key={category.category_id}>
                <img src='/favicon.ico' />
                <p>{category.name}</p>
              </li>
            ),
        )}
      {categoryIndex + nCategoriesOnScreen < categories.length && (
        <li
          onClick={(e) => {
            e.preventDefault;
            paginate(nCategoriesOnScreen);
          }}
        >
          <i>Next</i>
        </li>
      )}
    </ul>
  );
};

export default CategoryFilter;
