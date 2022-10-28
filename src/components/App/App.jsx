import { useState, useEffect } from "react";
import Notiflix from "notiflix";
import {makeApiRequest} from "../../services/api";
import {Searchbar} from '../Searchbar/Searchbar';
import {ImageGallery} from "../ImageGallery/ImageGallery";
import {ImageGalleryItem} from '../ImageGalleryItem/ImageGalleryItem';
import {Modal} from '../Modal/Modal';
import {Button} from '../Button/Button';
import {Wrapper} from "../App/App.styled";
import {SpinnerLoader} from "../Loader/Loader";

export const App = () => {

  const [searchValue, setSearchValue] = useState('')
  const [apiDataPictures, setApiDataPictures] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [largeImageSrc, setLargeImageSrc] = useState('')
  const [totalAmount, setTotalAmount] = useState(null)
  const [page, setPage] = useState(1)

  useEffect (() => {
    if(!searchValue) {
      return
    }

    const showMessageIfInvalidRequest = () => {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching ${searchValue}. Please try again.`)
    }

    const onRequestHandler = async () => {
      if (!searchValue) {
        return
      }
      try {
        setIsLoading(true)
        const dataResult = await makeApiRequest(searchValue, page)
        const dataHits = await dataResult.hits
        const dataTotalHits = await dataResult.totalHits
        setIsLoading(false)
        setTotalAmount(dataTotalHits)
  
        if (dataHits.length === 0) {
          showMessageIfInvalidRequest()
          return
        }
  
        if (page > 1) {
          setApiDataPictures(prevState => ([...prevState, ...dataHits]))
        }
  
        if (page === 1) {
          setApiDataPictures(dataHits)
        }
  
      } catch (error) {
        showErrorMessage()
      }
    }
    
    onRequestHandler()
  }, [searchValue, page])

  const onFormSubmitHandler = value => {
    setSearchValue(value)
    setPage(1)
    setApiDataPictures([])
  }

  const onImageHandler = largeImageUrl => {
    setLargeImageSrc(largeImageUrl)
  }

  const showErrorMessage = () => {
    Notiflix.Notify.failure(
      `Sorry, something went wrong. Please try again.`)
  }

  const checkToShowLoadMore = () => {
    const isLoadBtnShown = Math.ceil(totalAmount/12) > page 
    return isLoadBtnShown
  }

  const isLoadMoreBtn = checkToShowLoadMore()
  
  return (
    <Wrapper>
          <Searchbar onSubmit={onFormSubmitHandler} isSubmitting={isLoading}/>
              {isLoading && <SpinnerLoader/>}
                  {apiDataPictures.length > 0 && (
                  <ImageGallery>
                    <ImageGalleryItem getPictures={apiDataPictures} onImageClick={onImageHandler}/>
                    </ImageGallery>)}
                    {isLoadMoreBtn && <Button loadMore={() => {setPage(prevState => (prevState + 1))}} isActive={isLoading}/>}
                    {largeImageSrc && <Modal onModalClose={() => {setLargeImageSrc('')}}>
                      <img src={largeImageSrc} alt="large_image" />
                      </Modal>}
                      </Wrapper>
                      );
                  }

