(function() {

    const btn_api_1 = document.querySelector('#btn-api-1');
    const result_1 = document.querySelector('div.result-1');
    const btn_api_2 = document.querySelector('#btn-api-2');
    const result_2 = document.querySelector('div.result-2');
    const btn_api_3 = document.querySelector('#btn-api-3');
    const result_3 = document.querySelector('div.result-3');

    btn_api_1.addEventListener('click',  (e) => {
        e.preventDefault();
        fetchDataHandler(1, result_1);
    });

    btn_api_2.addEventListener('click',  (e) => {
        e.preventDefault();
        fetchDataHandler(10, result_2);
    });

    btn_api_3.addEventListener('click', (e) => {
        e.preventDefault();
        fetchDataHandler(15, result_3);
    });


    async function fetchDataHandler(timer, el) {
        const response = await fetch(`/api/user?timer=${timer}`, {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();

        el.innerHTML += `<div>${JSON.stringify(data)}</div>`;

        el.scrollTop = el.scrollHeight;
    }

})();