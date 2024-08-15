import React from 'react';
import PropTypes from 'prop-types';

function PopupDeleteCard(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        props.onDelete(); // Вызываем функцию onDelete для удаления задачи
    };
    const handleOverlayClick = (event) => {
        // Проверяем, что клик был именно на оверлей, а не внутри попапа
        if (event.target === event.currentTarget) {
            props.onClose();
        }
    };

    return (
        <div className={`popup  ${props.isOpen ? 'popup_opened' : ''}`} onClick={handleOverlayClick}>
            <div className="popup__submit">
                <button
                    onClick={props.onClose}
                    type="button"
                    className="popup__close-button"
                ></button>
                <h2 className="popup__question">Вы уверены?</h2>
                <form name="popupDelete" className="formDel" id="formDelete" onSubmit={handleSubmit}>
                    <button type="submit" className="popup__delete">
                        Да
                    </button>
                </form>
            </div>
        </div>
    );
}

PopupDeleteCard.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired // Добавляем пропс onDelete
};

export default PopupDeleteCard;