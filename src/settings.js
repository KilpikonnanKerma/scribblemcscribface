const buttons = document.querySelectorAll('#category-btn');

buttons.forEach(button => {
    button.addEventListener('click', () => { 
        document.querySelectorAll('.category').forEach(div => div.style.display = 'none');

        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'block';
    });
});