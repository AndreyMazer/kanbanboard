import React from "react";
import PropTypes from 'prop-types';
import okPic from "../images/galka.png";
import errorPic from "../images/neverno.png";

function InfoTooltip(props) {
    const handleOverlayClick = (evt) => {
        // Проверяем, что клик был именно на оверлей, а не внутри попапа
        if (evt.target === evt.currentTarget) {
            props.onClose();
        }
    };

    return (
        <div className={`popup ${props.isOpen ? "popup_opened" : ""}`} onClick={handleOverlayClick}>
            <div className="popup__infotooltip">
                <img
                    className="popup__regImage"
                    alt="результат"
                    src={props.status ? okPic : errorPic}
                />
                <h2 className="popup__feedback">
                    {props.message}
                </h2>
                <button
                    onClick={props.onClose}
                    type="button"
                    className="popup__close-button"
                ></button>
            </div>
        </div>
    );
}

InfoTooltip.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    status: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired
};

export default InfoTooltip; 