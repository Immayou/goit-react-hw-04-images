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

// export class App extends Component {

//   state = {
//    searchValue: '',
//    apiDataPictures: [],
//    isLoading: false,
//    largeImageSrc: '',
//    totalAmount: null,
//    page: 1,
//   }

//   async componentDidUpdate (prevProps, prevState) {
//     if (
//       prevState.searchValue !== this.state.searchValue ||
//       prevState.page !== this.state.page
//       ) {
//         await this.onRequestHandler()
//         }            
//   }

//   onRequestHandler = async () => {
//     const {searchValue, page} = this.state
//     try {
//       this.setState({ isLoading: true})
//       const dataResult = await makeApiRequest(searchValue, page)
//       const dataHits = await dataResult.hits
//       const dataTotalHits = await dataResult.totalHits
//       this.setState({ isLoading: false, totalAmount: dataTotalHits }) 

//       if (dataHits.length === 0) {
//         this.showMessageIfInvalidRequest()
//         return
//       }

//       if (page > 1) {
//         this.setState(prevState => ({apiDataPictures:[...prevState.apiDataPictures, ...dataHits]}))
//       }

//       if (page === 1) {
//         this.setState(prevState => ({apiDataPictures: dataHits}))
//       }

//     } catch (error) {
//       this.showErrorMessage()
//     }
//   }

//   onFormSubmitHandler = async value => {
//     this.setState({searchValue: value, page: 1, apiDataPictures: []})
//   }

//   onLoadMoreHandler = async () => {
//     this.setState(prevState => ({page: prevState.page + 1}))
//   }

//   onImageHandler = largeImageUrl => {
//     this.setState({largeImageSrc: largeImageUrl})
//   }

//   onModalCloseHandler = () => {
//     this.setState({largeImageSrc: ''})
//   }

//   showErrorMessage () {
//     Notiflix.Notify.failure(
//       `Sorry, something went wrong. Please try again.`)
//   }

//   showMessageIfInvalidRequest () {
//     Notiflix.Notify.failure(
//       `Sorry, there are no images matching ${this.state.searchValue}. Please try again.`)
//   }

//   checkToShowLoadMore () {
//     const isLoadBtnShown = Math.ceil(this.state.totalAmount/12) > this.state.page 
//     return isLoadBtnShown
//   }

//   render () {
//     const {isLoading, apiDataPictures, largeImageSrc} = this.state
//     const isLoadMoreBtn = this.checkToShowLoadMore()
//       return (
//     <Wrapper>
//           <Searchbar onSubmit={this.onFormSubmitHandler} isSubmitting={isLoading}/>
//               {isLoading && <SpinnerLoader/>}
//                   {apiDataPictures.length > 0 && (
//                   <ImageGallery>
//                     <ImageGalleryItem getPictures={apiDataPictures} onImageClick={this.onImageHandler}/>
//                     </ImageGallery>)}
//                     {isLoadMoreBtn && <Button loadMore={this.onLoadMoreHandler} isActive={isLoading}/>}
//                     {largeImageSrc && <Modal onModalClose={this.onModalCloseHandler}>
//                       <img src={largeImageSrc} alt="large_image" />
//                       </Modal>}
//                       </Wrapper>
//                       );
//                     };
//                   }

