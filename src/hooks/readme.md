current custom hooks: FullProductDetails, SupabaseCart, SupabaseRead, SupabaseStorage, SupabaseWrite

included in this readme: purpose, feature, parameter/returns, example/usage pattern for the hooks

basahin nyo na lang :)

////

SupabaseRead: made this hook to abstract supabase table reads into a single hook to read any data from supabase postgresql db.

can: read, filter, order, limit, obtain single row

params: tableName and queryOptions

returns:

    data

    loading

    error

to be added: pagination support

example:

    const { data: product, loading: productLoading, error: productError,} = useSupabaseRead('products', {
        filter: { id: id }, - filters by id
        single: true, - obtains single record/row
        select: '*, category:categories(id, name)', - grabs whole products table, along with id and name from categories table.
    });

////

SupabaseWrite: used for insert, update, delete operations on any supabase table

can: insert new rows, update existing ones, delete by filter

params: tableName

returns (this returns write functions that does the write/update operations):

    insertData(data)

    updateData(filter, updates)

    deleteData(filter)

    loading

    error

example:

    const { insertData, updateData, deleteData, loading, error } = useSupabaseWrite('products');

    await insertData({ name: 'Ryzen 5 5600', price: 9000 });
    await updateData({ id: 1 }, { price: 9500 });
    await deleteData({ id: 1 });

////

SupabaseStorage: handles uploading and deleting files in a Supabase

can: upload file to bucket, get public URL, delete files from bucket

params: bucketName

returns (this returns storage functions that does the write/delete operations):

    uploadFile

    deleteFile

    loading

    error

example:

    const { uploadFile, deleteFile, loading, error } = useSupabaseStorage('product-images');

    await uploadFile('uploads/cooler.png', selectedFile);
    await deleteFile('uploads/old-cooler.png');

////

SupabaseCart: fetches cart items for the currently logged-in user using a Supabase RPC (postgres) function

can: get all items in a user’s

returns:

    cartItems (array of items)

to be added: addToCart, updateQuantity, removeFromCart, and maybe separate cart calculation (probably going to be server side)

example:

    const { cartItems } = useSupabaseCart(); - auto fetches based on session?.user?.id

////

FullProductDetails fetches full product info including its category and its specs from a second table based on

can: get product data + category name based on category, also fetches product specs (e.g., from cpu, gpu, psu, etc.)

returns: product, productLoading, productError, spec, specLoading, specError

note: uses useSupabaseRead under the hood sets dynamic spec table based on category

fetch is enabled only when category is loaded, since it is dependent on category.

example:

    const { product, productLoading, productError, spec, specLoading, specError } = useFullProductDetails(id);
