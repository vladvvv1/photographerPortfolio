
import { createSupabaseWithoutToken } from "../config/supabaseClient.js";

const getPhoto = async (req, res) => {
  try {
    let { category } = req.body;
    const supabase = createSupabaseWithoutToken;

    if (!Array.isArray(category)) category = [category];

    // 1. Отримуємо category_id за назвою
    const { data: categoriesData, error: catError } = await supabase
      .from("categories")
      .select("id, name")
      .in("name", category);

    if (catError) throw catError;

    const categoryIds = categoriesData.map(cat => cat.id);

    // 2. Отримуємо фото через зв'язкову таблицю
    const { data: photoCategories, error: photoCatError } = await supabase
      .from("photo_categories")
      .select(`
        photo_id,
        photos (
          id,
          url,
          created_at
        )
      `)
      .in("category_id", categoryIds);

    if (photoCatError) throw photoCatError;

    // 3. Витягуємо унікальні фото
    const uniquePhotos = Array.from(
      new Map(photoCategories.map(p => [p.photos.id, p.photos])).values()
    );

    console.log(uniquePhotos);

    res.json(uniquePhotos);
  } catch (err) {
    console.error("Error loading photos:", err);
    res.status(500).json({ error: err.message });
  }
};


// const getPhoto = async (req, res) => {
//     try {
//         let { category } = req.body;
//         const supabase = createSupabaseWithoutToken;

//         if (!Array.isArray(category)) category = [category];

//         // Запит з JOIN між таблицями, щоб одразу отримати потрібні фото
//         const { data, error } = await supabase
//             .from("photos")
//             .select(`
//                 id,
//                 url,
//                 created_at,
//                 photo_categories (
//                     category_id,
//                     categories ( name )
//                 )
//             `);

//         if (error) throw error;

//         // Фільтруємо тільки ті фото, що мають хоч одну категорію з вибраних
//         const filteredPhotos = data.filter(photo =>
//             photo.photo_categories.some(rel =>
//                 category.includes(rel.categories.name)
//             )
//         );

//         console.log(filteredPhotos);

//         res.json(filteredPhotos);
//     } catch (err) {
//         console.error("Error loading photos:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

export default getPhoto;


// const getPhoto = async (req, res) => {
//     try {
//         let { category } = req.body;
//         const supabase = createSupabaseWithoutToken();

//         if (!Array.isArray(category)) category = [category];

//         const {data, error} = await supabase
//             .from("photos")
//             .select(`id, url, created_at, photo_categories (category_id, categories ( name )
//                 )
//             `);

//         if (error) throw error;


//         const { data: categoryData, error: categoryError } = await supabase
//             .from("categories")
//             .select("id")
//             .in("name", category);

//         if (categoryError) {
//             console.log(categoryError);
//             return res.status(404).json({ error: "Category not found." });
//         }

//         const category_id = categoryData.map(item => item.id);

//         if (category_id.length === 0) {
//             return res.status(404).json({ error: "No matching categories found." });
//         }

//         const { data: photoId, error: relationError } = await supabase
//             .from("photo_categories")
//             .select("photo_id")
//             .in("category_id", category_id);

//         if (relationError) throw relationError;

//         const photoIdList = photoId.map((p) => p.photo_id);
      
//         const { data: photos, error: photosError } = await supabase
//             .from("photos")
//             .select("*")
//             .in("id", photoIdList);

//         if (photosError) throw photosError;

//         console.log("Fetched pictures: ", photos);
//         res.json(photos);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// export default getPhoto;
