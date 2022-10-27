import React from "react";
import PropTypes from 'prop-types'; 
import { LoadMoreBtn } from "../Button/Button.styled";

export const Button = ({isActive, loadMore}) => {
    const onLoadMoreHandler = e => {
        e.preventDefault();
        loadMore()
    }

    return (
        <LoadMoreBtn onClick={onLoadMoreHandler} disabled={isActive}>Load More</LoadMoreBtn>
 )
}

Button.propTypes = {
    loadMore: PropTypes.func.isRequired,
  }
