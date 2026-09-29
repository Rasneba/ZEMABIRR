function setDataWithExpiry(key, value) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getDataWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Compare the expiry time with the current time
    if (now.getTime() > item.expiry) {
        // If the item has expired, remove it from storage and return null
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}

function dhm(second) {
    const days = Math.floor(second / (3600 * 24));
    const hours = Math.floor((second % (3600 * 24)) / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const seconds = second % 60;

    return {
        day: setZero(days),
        hour: setZero(hours),
        minute: setZero(minutes),
        second: setZero(seconds),
    };
};

const setZero = number => String(number).length === 1 ? `0${number}` : number;

function onOpenAttentionModal(props) {
    const { content, onOk, isVisibleCancelButton = true, title = 'Attention', okText = 'Ok', width = 320, prefix = false } = props;

    const titleElem = $(`#attentionModal .attention-modal-title`).addClass(prefix !== false ? `.${prefix}-attention-modal-title` : '');
    const okElem = $('#attentionModalOk');
    const cancelElem = $('#attentionModalCancel');
	
	if(prefix !== false){
		okElem.addClass(`${prefix}-relum-btn-ok`);
		cancelElem.addClass(`${prefix}-relum-btn-cancel`);
	}

    if (title) {
        titleElem.html(title);
    } else {
        titleElem.remove();
    }

    $(`.attention-modal`).addClass(prefix !== false ? `${prefix}-attention-modal` : '').css({ width });

    $(`#attentionModal .attention-modal-body`).addClass(prefix !== false ? `${prefix}-attention-modal-body` : '').html(content);

    okElem.html(okText);

    // Show the modal
    $('#attentionModalOverlay').fadeIn(300);

    if (isVisibleCancelButton) {
        cancelElem.show(); // Show the Cancel button
    } else {
        cancelElem.hide(); // Hide the Cancel button
    }

    // Close modal on cancel button click
    cancelElem.on('click', function () {
        $('#attentionModalOverlay').fadeOut(300);
    });

    // Handle Ok button click with custom callback
    $('#attentionModalOk').off('click').on('click', function () {
        if (typeof onOk === 'function') {
            onOk(() => $('#attentionModalOverlay').fadeOut(300));
        }
    });
}