import {useState,useEffect,useRef} from 'react';
import * as bootstrap from 'bootstrap';
import axios from "axios";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
    id: "",
    title: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: false,
    imageUrl: "",
    imagesUrl: [],
};


const Not_log= ({onSubmit,handleInputChange,formData})=>{
    return(
        <div className="container login"> 
                    <h1 className="mt-5">請先登入</h1>
                    <form className="form-floating form-signin"
                        onSubmit={(e)=>onSubmit(e)}>
                            <div className="mb-3">
                                <label htmlFor="Email1" className="form-label">電子信箱</label>
                                <input 
                                    type="email"
                                    name="username" 
                                    value={formData.username} 
                                    onChange={(e)=>handleInputChange(e)}    
                                    placeholder="Email" 
                                    className="form-control" 
                                    id="Email1" 
                                    aria-describedby="emailHelp" />

                                <div id="emailHelp" className="form-text">此Email為非公開,我們不會將該email分享給其他人</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Password" className="form-label">密碼</label>
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password} 
                                    onChange={(e)=>handleInputChange(e)}
                                    placeholder="password" 
                                    className="form-control" 
                                    id="Password" />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="CheckBox"/>
                                <label className="form-check-label" htmlFor="CheckBox">記住我</label>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-2">提交</button>
                    </form>
                </div> 
    )
};

const Logging=({checkLogin,products,tempProduct,openModal})=>{
    return (
        <>
                <div className="container signin">
                    <button
                        className="btn btn-danger mb-5"
                        type="button"
                        onClick={checkLogin}
                        >
                        確認是否登入
                    </button>
                    
                    <div className="container">
                        
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <h2>產品列表</h2>
                            <div className="text-end mt-4">
                                <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => openModal("create",INITIAL_TEMPLATE_DATA)}>
                                建立新的產品
                                </button>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>分類</th>
                                    <th>產品名稱</th>
                                    <th>原價</th>
                                    <th>售價</th>
                                    <th>是否啟用</th>
                                    <th>編輯</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products && products.length > 0 ? (
                                    products.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.category}</td>
                                        <td>{item.title}</td>
                                        <td>{item.origin_price}</td>
                                        <td>{item.price}</td>
                                        <td className={`${item.is_enabled?"text-success":""}`}>
                                            {item.is_enabled ? "啟用" : "未啟用"}
                                        </td>
                                        <td>
                                            <div className="btn-group btn-group-pill" role="group" aria-label="Basic example">
                                                <button type="button" className="btn btn-outline-primary btn-sm"
                                                onClick={()=>{openModal("edit",item)}}>編輯</button>
                                                <button type="button" className="btn btn-outline-danger  btn-sm"
                                                onClick={()=>{openModal('delete',item)}}>刪除</button>
                                            </div>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="5">尚無產品資料</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <h2>單一產品細節</h2>
                            {tempProduct ? (
                                <div className="card mb-3">
                                <img
                                    src={tempProduct.imageUrl}
                                    className="card-img-top primary-image"
                                    alt="主圖"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                    {tempProduct.title}
                                    <span className="badge bg-primary ms-2">
                                        {tempProduct.category}
                                    </span>
                                    </h5>
                                    <p className="card-text">
                                    商品描述：{tempProduct.description}
                                    </p>
                                    <p className="card-text">商品內容：{tempProduct.content}</p>
                                    <div className="d-flex">
                                    <p className="card-text text-secondary">
                                        <del>{tempProduct.origin_price}</del>
                                    </p>
                                    元 / {tempProduct.price} 元
                                    </div>
                                    <h5 className="mt-3">更多圖片：</h5>
                                    <div className="d-flex flex-wrap">
                                    {tempProduct.imagesUrl?.map((url, index) => (
                                        <img
                                        key={index}
                                        src={url}
                                        className="images"
                                        alt="副圖"
                                        />
                                    ))}
                                    </div>
                                </div>
                                </div>
                            ) : (
                                <p className="text-secondary">請選擇一個商品查看</p>
                            )}
                            </div>
                    </div>
                    </div>
                    
                    
                </div>
        </>
    )
};

const AddProduct=({templeteData,closeModal,handleModalInputChange,handleModalImageChange
    ,handleAddImage,handleRemoveImage,updateProduct,modalType,delProduct})=>{
    return (
    <div className="modal fade" tabIndex="-1"
        id="productModal" aria-labelledby='productModalLabel'
        aria-hidden='true'>
        <div className="modal-dialog modal-xl">
            <div className="modal-content border-0">
                <div className={`modal-header bg-${modalType==="delete"?"danger":"dark"} text-white`}>
                    <h5 id="productModalLabel" className="modal-title">
                    <span>{modalType==="delete"?"移除":
                        modalType==="edit"?"編輯":"新增"}產品</span>
                    </h5>
                    <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ></button>
                </div>

                {
                    modalType==="delete"?(
                        <>
                            {/* modal-body 顯示內容 */}
                            <div className="modal-body">
                                <p className="fs-4">
                                確定要刪除
                                <span className="text-danger">{templeteData.title}</span>嗎？
                                </p>
                            </div>

                            {/* modal-footer 刪除按鈕 */}
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={()=>delProduct(templeteData.id)}
                                >
                                    刪除
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={()=>closeModal()}
                                >
                                    取消
                                </button>
                            </div>
                        </>
                    ):(<>
                        <div className="modal-body">
                            <div className="row">
                            <div className="col-sm-4">
                                <div className="mb-2">
                                <div className="mb-3">
                                    <label htmlFor="imageUrl" className="form-label">
                                    輸入主圖片網址
                                    </label>
                                    <input
                                    type="text"
                                    id="imageUrl"
                                    name="imageUrl"
                                    className="form-control"
                                    placeholder="請輸入主圖片連結"
                                    value={templeteData.imageUrl}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                </div>
                                <img 
                                    className="img-fluid" 
                                    src={templeteData.imageUrl} 
                                    alt="主圖" />
                                </div>
                                <br/>
                                <div className="container">
                                    <div className="row row-cols-1 row-cols-2 md-2 g-4">
                                        {
                                            templeteData.imagesUrl.map((url,index)=>{
                                                return (
                                                    <div className="row mt-2 ms-2" key={index}>
                                                        <label htmlFor="imageUrl" className="form-label">
                                                            輸入次要圖片網址
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={url}
                                                            onChange={(e)=>handleModalImageChange(index,e.target.value)}
                                                        />
                                                        {
                                                            url &&(
                                                                <img
                                                                    className="img-fluid"
                                                                    src={url || undefined}
                                                                    alt={`副圖${index + 1}`}
                                                                />
                                                            )
                                                        }
                                                        
                                                    </div>
                                                )
                                            })
                                            
                                        }   
                                    </div> 
                                </div>

                                <br/>
                                <div>
                                    <button className="btn btn-primary btn-sm d-block w-100"
                                    onClick={()=>handleAddImage()}>
                                        新增圖片
                                    </button>
                                </div>
                                <br/>

                                <div>
                                    <button className="btn btn-danger btn-sm d-block w-100"
                                    onClick={()=>handleRemoveImage()}>
                                        刪除圖片
                                    </button>
                                </div>
                            </div>

                            <div className="col-sm-8">
                                <div className="mb-3">
                                <label htmlFor="title" className="form-label">標題</label>
                                <input
                                    name="title"
                                    id="title"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入標題"
                                    value={templeteData.title}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                </div>

                                <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="category" className="form-label">分類</label>
                                    <input
                                    name="category"
                                    id="category"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入分類"
                                    value={templeteData.category}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="unit" className="form-label">單位</label>
                                    <input
                                    name="unit"
                                    id="unit"
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入單位"
                                    value={templeteData.unit}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                </div>
                                </div>

                                <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="origin_price" className="form-label">原價</label>
                                    <input
                                    name="origin_price"
                                    id="origin_price"
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    placeholder="請輸入原價"
                                    value={templeteData.origin_price}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label htmlFor="price" className="form-label">售價</label>
                                    <input
                                    name="price"
                                    id="price"
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    placeholder="請輸入售價"
                                    value={templeteData.price}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                </div>
                                </div>
                                <hr />

                                <div className="mb-3">
                                <label htmlFor="description" className="form-label">產品描述</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    placeholder="請輸入產品描述"
                                    value={templeteData.description}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                <label htmlFor="content" className="form-label">說明內容</label>
                                <textarea
                                    name="content"
                                    id="content"
                                    className="form-control"
                                    placeholder="請輸入說明內容"
                                    value={templeteData.content}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                <div className="form-check">
                                    <input
                                    name="is_enabled"
                                    id="is_enabled"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={templeteData.is_enabled}
                                    onChange={(e)=>handleModalInputChange(e)}
                                    />
                                    <label className="form-check-label" htmlFor="is_enabled">
                                    是否啟用
                                    </label>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => closeModal()}
                            >
                            取消
                            </button>
                            <button type="button" className="btn btn-primary"
                            onClick={()=>updateProduct(templeteData.id)}>確認</button>
                        </div>
                        </>
                    )
                }

            </div>
        </div>
    </div>
    )
}

function App(){

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [isAuth, setIsAuth] = useState(false);
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState(null);
    const productModalRef= useRef(null);
    const [modalType,setModalType]= useState('');
    const [templeteData,setTempleteData]=useState(INITIAL_TEMPLATE_DATA); 



    // 1. 封裝：設定 Token 到 Cookie 與 Axios Header
    const setAuthToken = (token, expired) => {
        // 存入 Cookie
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/;`;
        // 設定 Axios 預設 Header
        axios.defaults.headers.common['Authorization'] = token;
    };

    // 2. 封裝：取得產品資料 (加上防錯)
    const getDatas = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
            setProducts(res.data.products);
            productModalRef.current=new bootstrap.Modal(document.getElementById('productModal'), {
                keyboard: false
            })
        } catch (err) {
            console.error("取得產品失敗", err.response?.data?.message || err.message);
        }
    };

    // 3. 處理輸入變更
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    //處理新增產品資料方法
    const handleModalInputChange=(e)=>{
        const {name,value,checked,type}=e.target;
        setTempleteData((pre)=>({
            ...pre,
            [name]: type==="checkbox"?checked:value
        }))
    }

    //處理多層圖片轉換
    const handleModalImageChange=(index,value)=>{
        setTempleteData((pre)=>{
            const newImage =[...pre.imagesUrl];
            newImage[index]=value;

            //當陣列資料不滿五筆時,會因為自動加入子圖片而加入新圖片提示框
            if(value !=="" && index ===newImage.length-1 &&newImage.length<5){
                newImage.push('')
            };

            //若陣列資料不少於一筆,且在自動更新後發現資料串為空值,則該筆資料輸入框會被取消
            if(value==="" && newImage.length>1 &&newImage[newImage.length-1]===""){
                newImage.pop();
            }
            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    };

    //新增input圖片區
    const handleAddImage=()=>{
        setTempleteData((pre)=>{
            const newImage =[...pre.imagesUrl];
            newImage.push('');

            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    };

    
    //移除input圖片區
    const handleRemoveImage=()=>{
        setTempleteData((pre)=>{
            const newImage =[...pre.imagesUrl];
            newImage.pop();

            return {
                ...pre,
                imagesUrl: newImage
            }
        })
    };


    // 4. 登入提交
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/admin/signin`, formData);
            const { token, expired } = res.data;

            // 執行封裝好的設定
            setAuthToken(token, expired);
            
            alert("登入成功");
            setIsAuth(true);
            getDatas(); // 登入成功後直接抓資料
        } catch (err) {
            alert("登入失敗：" + (err.response?.data?.message || "請檢查帳密"));
            setIsAuth(false);
        }
    };

    // 確認登入函式
    const checkLogin = async () => {
        try {
            // 這裡不需要 formData，因為驗證是靠 Header 裡的 Token
            const res = await axios.post(`${API_BASE}/api/user/check`);
            
            // 如果成功，res.data 通常會包含 success: true 與 uid
            if (res.data.success) {
                // 提醒：請確認該 API 是否有回傳 uid，部分版本是在 res.data.uid
                alert(`驗證成功！你的 UID 為：${res.data.uid || '已取得驗證'}`);
                console.log("完整驗證資訊：", res.data);
                setIsAuth(true); // 確保狀態同步
            }
        } catch (err) {
            console.error("驗證失敗：", err.response?.data?.message);
            alert(`驗證失敗或登入已過期，請重新登入`);
            setIsAuth(false);
        }
    };

    // 5. 元件掛載時檢查 Cookie
    useEffect(() => {
        const token = document.cookie
            .replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if (token) {
            // 先把 Token 塞入 Header
            axios.defaults.headers.common['Authorization'] = token;

            
            // 驗證 Token 是否依然有效
            axios.post(`${API_BASE}/api/user/check`)
                .then(() => {
                    setIsAuth(true);
                    getDatas(); // 驗證成功才抓資料
                })
                .catch((err) => {
                    console.error("驗證失效", err);
                    setIsAuth(false);
                });
        }
    }, []);
    
    const openModal=(type,product)=>{
        // console.log(product);
        setModalType(type);

        setTempleteData((pre)=>({
            ...pre,
            ...product
        }));

        productModalRef.current.show();
    };

    const closeModal=()=>{
        productModalRef.current.hide();
    };

        //根據不同條件來決定執行甚麼功能

    const updateProduct= async(id)=>{

        let url= `${API_BASE}/api/${API_PATH}/admin/product`;
        let method="post";

        if(modalType==="edit"){
            url=`${API_BASE}/api/${API_PATH}/admin/product/${id}`;
            method="put";
        }

        if(modalType==="create"){
            url=`${API_BASE}/api/${API_PATH}/admin/product`;
            method="post"
        }

        if(modalType==="delete"){
            url=`${API_BASE}/api/${API_PATH}/admin/product/${id}`
            method="delete"
        }

        //設定資料庫內容

        const productData ={
            data:{
                ...templeteData,
                origin_price: Number(templeteData.origin_price),
                price: Number(templeteData.price),
                is_enabled: templeteData.is_enabled? 1:0,
                imagesUrl: templeteData.imagesUrl.filter((url)=>url!=="")
            }
        }

        try{
            const res= await axios({
                method:method, //動態輸入post||put
                url: url,
                data: productData
            });

            console.log(res.data);
            alert(modalType==="edit"?"更新資料成功":"新增資料成功");
            // 當一切輸入成功後,就會取得新資料
            getDatas();
            // 並且關閉更新資料頁面
            closeModal();
        }catch(err){
            const errorMsg = err.response?.data?.message || "發生未知錯誤";
            alert(`發生${errorMsg}錯誤`)
        }
    };

    //刪除資料
    const delProduct = async(id)=>{
        try{
            const res= await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
            console.log(res.data);
            alert(`${res.data.message}`)
            getDatas();
            closeModal();
        }catch(err){
            alert(`發生${err.response}錯誤!`)
        }
    }
    // const config = {
    //     headers: { Authorization: token },
    // };

    return (
        <>
            {!isAuth?(
                <>
                    <Not_log onSubmit={onSubmit} handleInputChange={handleInputChange}
                    formData={formData}/>
                </>
            ):(
                <>
                    <Logging checkLogin={checkLogin}
                    products={products} tempProduct={tempProduct} openModal={openModal}/>

                    <AddProduct productModalRef={productModalRef} closeModal={closeModal} 
                        templeteData={templeteData} handleModalInputChange={handleModalInputChange}
                        handleModalImageChange={handleModalImageChange} handleAddImage={handleAddImage}
                        handleRemoveImage={handleRemoveImage} updateProduct={updateProduct}
                        modalType={modalType} delProduct={delProduct}/>
                </>
            )}
        </>
    )
}

export default App;