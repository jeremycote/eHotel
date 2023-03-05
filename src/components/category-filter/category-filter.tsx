import { Category } from '@/src/types/Category';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './category-filter.module.css';

interface CategoryFilterProps {
  height: string;
  itemWidth: string;
  itemSpacing: string;
}

const CategoryFilter = ({
  height,
  itemWidth,
  itemSpacing,
}: CategoryFilterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('api/get-categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
    setIsLoading(false);
  }, []);

  return (
    <ul className={styles.categoryFilter} style={{ height: height }}>
      {!isLoading &&
        categories.map((category, index) => (
          <li
            key={category.category_id}
            style={{ marginLeft: index > 0 ? itemSpacing : '0' }}
          >
            <a style={{ width: itemWidth }}>
              <img src='/favicon.ico' />
              <p>{category.name}</p>
            </a>
          </li>
        ))}
    </ul>
  );
};

export default CategoryFilter;
