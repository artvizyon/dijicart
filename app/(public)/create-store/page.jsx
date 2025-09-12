'use client'
import { assets } from '@/assets/assets'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'
import { useAuth, useUser } from '@clerk/nextjs' // EkO&T
import { useRouter } from 'next/navigation' // EkO
import axios from 'axios' // EkO

export default function CreateStore() {
  const { user } = useUser() // EkO
  const router = useRouter() // EkO
  const { getToken } = useAuth() // EkO

  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [storeInfo, setStoreInfo] = useState({
    name: '',
    username: '',
    description: '',
    email: '',
    contact: '',
    address: '',
    image: '',
  })

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
  }

  // EkTw
  const fetchSellerStatus = async () => {
    const token = await getToken()
    try {
      const { data } = await axios.get('/api/store/create', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (['approved', 'rejected', 'pending'].includes(data.status)) {
        setStatus(data.status)
        setAlreadySubmitted(true)
        switch (data.status) {
          case 'approved':
            setMessage(
              'Mağazanız onaylandı, artık kontrol panelinizden mağazanıza ürün ekleyebilirsiniz.'
            )
            setTimeout(() => router.push('/store'), 5000)
            break
          case 'rejected':
            setMessage(
              'Mağaza başvurunuz reddedildi, daha fazla bilgi için yöneticiyle iletişime geçin.'
            )
            break
          case 'pending':
            setMessage(
              'Mağaza başvurunuz ve bilgileriniz kontrol aşamasında. Kontrol işlemleri sonrasında tarafınıza bildirim gönderilecektir.'
            )
            break

          default:
            break
        }
      } else {
        setAlreadySubmitted(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    }
    setLoading(false)
  }
  // EK END

  // EK START
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    // EkO Logic 2 submit shop details
    if (!user) {
      return toast('Devam etmek için lütfen giriş yapınız!') // ('Please login to continue!')
    }
    try {
      const token = await getToken()

      const formData = new FormData()

      formData.append('name', storeInfo.name)
      formData.append('description', storeInfo.description)
      formData.append('username', storeInfo.username)
      formData.append('email', storeInfo.email)
      formData.append('contact', storeInfo.contact)
      formData.append('address', storeInfo.address)
      formData.append('image', storeInfo.image)

      // EkO
      const { data } = await axios.post('/api/store/create', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success(data.message)
      await fetchSellerStatus() //EkTw
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    }
  }

  // EkTt
  useEffect(() => {
    if (user) {
      fetchSellerStatus()
    }
  }, [user])

  // EK
  if (!user) {
    return (
      <div className='min-h-[80vh] mx-6 flex items-center justify-center text-slate-400'>
        <h1 className='text-2xl sm:text-4xl font-semibold'>
          Devam etmek için lütfen <span className='text-slate-500'>Giriş</span> yapınız!
        </h1>
      </div>
    )
  }

  return !loading ? (
    <>
      {!alreadySubmitted ? (
        <div className='mx-6 min-h-[70vh] my-16'>
          <form
            onSubmit={(e) =>
              toast.promise(onSubmitHandler(e), { loading: 'Bilgileriniz kontrol ediliyor...' })
            }
            className='max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500'
          >
            {/* Title */}
            <div>
              <h1 className='text-3xl '>
                <span className='text-slate-800 font-medium'>Mağaza</span> Bilgilerini Düzenle
              </h1>
              <p className='max-w-lg'>
                Dijitrend'te satıcı olmak için mağaza bilgilerinizi doldurmanız gerekmektedir.
                Bilgilerinizin doğrulanması sonrasında Mağazanız etkinleştirilecektir.
              </p>
            </div>

            <label className='mt-10 cursor-pointer'>
              Mağaza Logosu
              <Image
                src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area}
                className='rounded-lg mt-2 h-16 w-auto'
                alt=''
                width={150}
                height={100}
              />
              <input
                type='file'
                accept='image/*'
                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                hidden
              />
            </label>

            <p>Mağaza Kullancı Adı</p>
            <input
              name='username'
              onChange={onChangeHandler}
              value={storeInfo.username}
              type='text'
              placeholder='Mağaza kullanıcı adını giriniz..'
              className='border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded'
            />

            <p>Mağaza İsmi</p>
            <input
              name='name'
              onChange={onChangeHandler}
              value={storeInfo.name}
              type='text'
              placeholder='Mağaza adını giriniz..'
              className='border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded'
            />

            <p>Açıklama</p>
            <textarea
              name='description'
              onChange={onChangeHandler}
              value={storeInfo.description}
              rows={5}
              placeholder='Mağaza hakkında açıklamanızı giriniz..'
              className='border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none'
            />

            <p>Eposta</p>
            <input
              name='email'
              onChange={onChangeHandler}
              value={storeInfo.email}
              type='email'
              placeholder='Eposta adresinizi giriniz..'
              className='border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded'
            />

            <p>İletişim Numaranız</p>
            <input
              name='contact'
              onChange={onChangeHandler}
              value={storeInfo.contact}
              type='text'
              placeholder='İletişim numaranızı giriniz'
              className='border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded'
            />

            <p>Adres</p>
            <textarea
              name='address'
              onChange={onChangeHandler}
              value={storeInfo.address}
              rows={5}
              placeholder='Adres bilgilerini giriniz..'
              className='border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none'
            />

            <button className='bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition '>
              Kayıt Oluştur
            </button>
          </form>
        </div>
      ) : (
        <div className='min-h-[80vh] flex flex-col items-center justify-center'>
          <p className='sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl'>
            {message}
          </p>
          {status === 'approved' && (
            <p className='mt-5 text-slate-400'>
              Yönetim paneline giriş için <span className='font-semibold'>5 seconds</span>
            </p>
          )}
        </div>
      )}
    </>
  ) : (
    <Loading />
  )
}
