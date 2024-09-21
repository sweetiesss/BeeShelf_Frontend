import { CaretDown, CaretUp, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "../../style/Partner.scss";
const products = [
  {
    id: 1,
    image: "https://via.placeholder.com/50", // Replace with real image
    sku: "101-elz",
    name: "Silky Creamy Donkey Steam Moisture",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["egf", "retinol", "creams"],
  },
  {
    id: 2,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },
  {
    id: 3,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },
  {
    id: 4,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },
  {
    id: 5,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },

  // Add more products as needed
];
export default function ProductPage() {
  const [isShowDetailProduct, setShowDetailProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [overall, setOverall] = useState({
    checked: false,
    indeterminate: false,
  });
  useEffect(() => {
    const checkCount = selectedProducts.length;
    if (checkCount == 1) {
      setOverall({ checked: true, indeterminate: false });
    } else {
      setOverall({ checked: false, indeterminate: true });
    }
  }, [selectedProducts]);

  const handleShowDetailProductProduct = (e, product) => {
    e.stopPropagation();
    setShowDetailProduct(isShowDetailProduct === product ? null : product);
  };

  const toggleProductSelection = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product)
        ? prevSelected.filter((p) => p !== product)
        : [...prevSelected, product]
    );
  };

  const isProductSelected = (product) => {
    return selectedProducts.includes(product);
  };

  const handleClickOverall = (e) => {
    e.stopPropagation();
    setSelectedProducts([]);
  };
  return (
    <div className="w-full h-full ">
      <div className="flex items-center justify-stretch space-x-10 ">
        <p className="text-3xl font-bold">Products</p>
        <div className="focus-within:outline-black flex bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline outline-[var(--line-main-color)]">
          <label className="opacity-70">Category:</label>
          <select name="category" className="pr-2 outline-none">
            <option>Cosemetic</option>
          </select>
        </div>
        <div className="focus-within:outline-black flex bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline outline-[var(--line-main-color)]">
          <label className="opacity-70">Brand:</label>
          <select name="category" className="pr-2 outline-none">
            <option>Ladygaga</option>
          </select>
        </div>
        <div className="flex items-center outline-[var(--line-main-color)] focus-within:outline-black text-[var(--text-second-color)] focus-within:text-[var(--text-main-color)] bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline">
          <MagnifyingGlass size={18} weight="bold" />
          <input
            className="outline-none pl-1 ml-1 border-0 border-l-2 border-[var(--line-main-color)] focus-within:border-black "
            placeholder="Quick Search"
          />
        </div>
        <button className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold">
          + Add Product
        </button>
        <button className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold">
          + Add Product
        </button>
      </div>
      <div className="mt-5 flex space-x-10 items-center">
        <select className="pr-1 bg-inherit text-[var(--text-main-color)] font-bold text-xl rounded-xl outline-none">
          <option>IN STOCK</option>
          <option>OUT STOCK</option>
        </select>
        <div className="font-semibold ">
          {selectedProducts.length}/{products.length} Total producs
        </div>
        <div className={`bg-blue-500 px-3 py-1 rounded-xl ${selectedProducts.length===0&&"opacity-70"}`} >
          <select className="bg-inherit pr-1" disabled={selectedProducts.length===0}>
            <option>Add to Inventory</option>
            <option>Inventory A</option>
            <option>Inventory B</option>
          </select>
        </div>
        <button className={`bg-blue-500 px-3 py-1 rounded-xl ${selectedProducts.length===0&&"opacity-70"}`} disabled={selectedProducts.length===0}>Delete</button>
        <button className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold">
          + Add Product
        </button>
      </div>
      <div className="p-4">
        <div className="shadow-lg bg-white rounded-lg p-4 custome-table mb-3">
          <div className="flex w-full">
            <div className="text-left pb-2  column-1">
              {selectedProducts.length > 0 ? (
                <input
                  type="checkbox"
                  checked={overall.checked}
                  onChange={handleClickOverall}
                  ref={(input) =>
                    input && (input.indeterminate = overall.indeterminate)
                  }
                />
              ) : (
                "#"
              )}
            </div>
            <div className="text-left pb-2   column-2"></div>
            <div className="text-left pb-2 column-3">SKU</div>
            <div className="text-left pb-2  column-4">Name</div>
            <div className="text-left pb-2  column-5">Group</div>
            <div className="text-left pb-2 column-6">Category</div>
            <div className="text-left pb-2  column-7 ">Price</div>
            <div className="text-left pb-2  column-8 ">Tags</div>
            <div className="text-left pb-2  column-9 "></div>
          </div>
          {products.map((product) => {
            let check = isShowDetailProduct === product;
            let chooice =
              selectedProducts.filter((pro) => pro == product).length > 0
                ? true
                : false;
            return (
              <div
                className={` ${
                  check
                    ? " bg-[var(--main-color)]  border-2 rounded-xl shadow-xl "
                    : "hover:bg-gray-100 border-t-2 "
                } cursor-pointer ${chooice ? "bg-[var(--second-color)]" : ""}`}
                onClick={() => toggleProductSelection(product)}
                key={product.id}
              >
                <div className="flex items-center">
                  <div className=" px-1 py-2 column-1">
                    <input
                      type="checkbox"
                      checked={isProductSelected(product)}
                      onChange={() => toggleProductSelection(product)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className=" px-1 py-2 column-2"></div>
                  <div className=" px-1 py-2 column-3">{product.sku}</div>
                  <div className=" px-1 py-2 column-4">{product.name}</div>
                  <div className=" px-1 py-2 column-5">
                    <select
                      defaultValue={product.group}
                      className="border p-1 rounded-md"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div className=" px-1 py-2 column-6">{product.category}</div>
                  <div className=" px-1 py-2 column-7">{product.price}</div>
                  <div className=" px-1 py-2 column-8">{product.tags}</div>
                  <div className=" px-1 py-2 column-9">
                    <button
                      className={`border-2 px-2 rounded-xl shadow-lg text-2xl ${
                        check
                          ? "border-[var(--line-oposite-color)] text-[var(--text-main-color)]"
                          : "text-[var(--text-second-color)]"
                      } `}
                      onClick={(e) =>
                        handleShowDetailProductProduct(e, product)
                      }
                    >
                      {check ? (
                        <CaretUp weight="fill" />
                      ) : (
                        <CaretDown weight="fill" />
                      )}
                    </button>
                  </div>
                </div>
                {check && (
                  <div className="">
                    <div className=" p-4 ">
                      <div className="flex">
                        <img
                          src={isShowDetailProduct.image}
                          alt={isShowDetailProduct.name}
                          className="h-32 w-32"
                        />
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold">
                            {isShowDetailProduct.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            SKU: {isShowDetailProduct.sku}
                          </p>
                          <p>Price: {isShowDetailProduct.price}</p>
                          <p>Stock: {isShowDetailProduct.stock}</p>
                          <p>Reserved: {isShowDetailProduct.reserved}</p>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Tags:</p>
                            <div className="flex gap-2">
                              {isShowDetailProduct.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-200 text-sm rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
