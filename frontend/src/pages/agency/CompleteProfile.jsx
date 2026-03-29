import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutThunk } from "../../features/auth/authThunks"
import { ViewAgence2, ViewSuccess } from "../register/components"

export default function CompleteProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [successType, setSuccessType] = useState(null)

  const handleSuccess = (type) => {
    setSuccessType(type)
  }

  if (successType) {
    return (
      <div className="rp-root">
        <div className="rp-page">
          <div className="rp-right">
            <div className="rp-form-wrap">
              <ViewSuccess type={successType} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rp-root">
      <div className="rp-page">
        <div className="rp-right">
          <div className="rp-form-wrap">
            <ViewAgence2
              onBack={() => {
                // S'ils annulent, on les déconnecte pour revenir à l'accueil
                dispatch(logoutThunk())
                navigate('/')
              }}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
