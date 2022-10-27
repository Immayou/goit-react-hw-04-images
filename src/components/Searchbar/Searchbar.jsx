import { useState } from "react";
import PropTypes from 'prop-types';
import Notiflix from "notiflix";
import { HeaderForm, SearchForm, SearchFormButton, SearchFormInput } from "../Searchbar/Searchbar.styled";
import {TiEject} from 'react-icons/ti';

export const Searchbar = ({onSubmit, isSubmitting}) => {

  const [searchInput, setSearchInput] = useState('')

  const inputHandler = e => {
    setSearchInput (e.currentTarget.value.toLowerCase())
    }

  const formSubmitHandler = e => {
    e.preventDefault();
    if (searchInput.trim() === '') {
      Notiflix.Notify.info("Enter your query, please!")
      return
    }
    onSubmit(searchInput)
    }
    
  return (
    <HeaderForm>
    <SearchForm onSubmit={formSubmitHandler}>
      <SearchFormButton type="submit" disabled={isSubmitting}>
          <TiEject size = '25px'/>
      </SearchFormButton>
      <SearchFormInput
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
        onChange={inputHandler}
        value={searchInput}
      />
    </SearchForm>
  </HeaderForm>
 )
}


Searchbar.propTypes = {
  isSubmitting: PropTypes.bool.isRequired
}