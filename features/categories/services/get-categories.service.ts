import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Category,
} from '../types/category.types';

export async function getCategoriesService() {

  const categoriesRef =
    collection(
      db,
      'categories',
    );

  const categoriesQuery =
    query(
      categoriesRef,
      orderBy(
        'year',
        'desc',
      ),
    );

  const snapshot =
    await getDocs(
      categoriesQuery,
    );

  const categories: Category[] =
    snapshot.docs.map(
      (
        doc,
      ) => ({

        id:
          doc.id,

        ...doc.data(),
      }),
    ) as Category[];

  return categories;
}