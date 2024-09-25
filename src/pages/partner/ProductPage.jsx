import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  CaretUp,
  FilePlus,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
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
  const DetailProduct = () => {
    return (
      <div className="detail-product">
        <div className=" p-4 ">
          <div className="flex">
            <div className="space-y-2">
              <div className="relative">
                <img
                  src={isShowDetailProduct.image}
                  alt={isShowDetailProduct.name}
                  className="h-48 w-h-48 rounded-xl"
                />
                <div
                  className="absolute top-3 right-3 w-5 h-5 flex justify-center items-center
               opacity-50 hover:opacity-100  
               bg-white rounded-full
               "
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus weight="bold" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4">
                <div className="px-2 py-1 border-[var(--line-main-color)]  border-2  bg-white rounded-xl shadow-lg">
                  <ArrowLeft className="" weight="bold" />
                </div>
                <p className="">1 of 3</p>
                <div className="px-2 py-1 border-[var(--line-main-color)]  border-2 bg-white rounded-xl shadow-lg">
                  <ArrowRight className="" weight="bold" />
                </div>
              </div>
            </div>
            <div className="ml-4">
              <div>
                <div>
                  <label>Display Name</label>
                  <p className="">{isShowDetailProduct.name}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <label>SKU</label>
                    <p>{isShowDetailProduct.sku}</p>
                  </div>
                  <div>
                    <label>Barcode</label>
                    <p>{isShowDetailProduct.sku}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <label>Brand</label>
                    <p>{isShowDetailProduct.sku}</p>
                  </div>
                  <div>
                    <label>Vendor</label>
                    <p>{isShowDetailProduct.sku}</p>
                  </div>
                </div>
              </div>
              <div>
                <label>Price:</label>
                <p>{isShowDetailProduct.price}</p>
              </div>
              <div>
                <label>Stock: </label>
                <p>{isShowDetailProduct.stock}</p>
              </div>
              <div>
                <label>Site: </label>
                <p>{isShowDetailProduct.stock}</p>
              </div>
              <div>
                <label>Reserved: </label>
                <p>{isShowDetailProduct.reserved}</p>
              </div>
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
    );
  };
  return (
    <div className="w-full h-full flex justify-between">
      <div className="w-fit">
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
            Import Excel
          </button>
          <button className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold">
            Exprot Excel
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
          <div
            className={`bg-blue-500 px-3 py-1 rounded-xl ${
              selectedProducts.length === 0 && "opacity-70"
            }`}
          >
            <select
              className="bg-inherit pr-1"
              disabled={selectedProducts.length === 0}
            >
              <option>Add to Inventory</option>
              <option>Inventory A</option>
              <option>Inventory B</option>
            </select>
          </div>
          <button
            className={`bg-blue-500 px-3 py-1 rounded-xl ${
              selectedProducts.length === 0 && "opacity-70"
            }`}
            disabled={selectedProducts.length === 0}
          >
            Delete
          </button>
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
                  } cursor-pointer ${
                    chooice ? "bg-[var(--second-color)]" : ""
                  }`}
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                    <div className=" px-1 py-2 column-6">
                      {product.category}
                    </div>
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
                  {check && <DetailProduct />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-[var(--main-color)] w-fit flex-grow p-10 rounded-xl shadow-xl border-2 border-[var(--line-main-color)] h-fit">
        <div className="font-semibold text-xl mb-5">OverView</div>
        <div className="mb-3">
          <div className="text-[var(--text-second-color)]">Sku total</div>
          <div className="text-2xl font-semibold">12,312</div>
        </div>
        <div className="mb-3">
          <div className="text-[var(--text-second-color)]">
            Product Reserved
          </div>
          <div className="text-2xl font-semibold">122</div>
        </div>
        <div className="mb-3">
          <div className="text-[var(--text-second-color)]">Stocl Issue</div>
          <div className="text-2xl font-semibold">1</div>
        </div>
      </div>
    </div>
  );
}
