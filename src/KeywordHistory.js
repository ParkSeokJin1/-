import uniqueArray from './utils/uniqueArray.js';

// SearchInput 컴포넌트 하위에 배치
    class KeywordHistory {
    $keywordHistory = null;
    data = null;

    constructor({ $target, onSearch }) {
        const $KeywordHistory = document.createElement('ul');
        this.$KeywordHistory = $KeywordHistory;
        this.$KeywordHistory.className = 'KeywordHistory';
        $target.appendChild(this.$KeywordHistory);

  

     this.onSearch = onSearch;
     this.init();
     this.render();

    
    }

    init() {
     const data = this.getHistory();
      this.setState(data);
    }

    addKeyword(keyword) {
        let KeywordHistory = this.getHistory();
        KeywordHistory.unshift(keyword);
        // 중복제거 
        KeywordHistory = uniqueArray(KeywordHistory);
        KeywordHistory = KeywordHistory.slice(0, 5);
        localStorage.setItem('KeywordHistory', KeywordHistory.join(','));
     
    this.init()

    }

    getHistory() {
    return localStorage.getItem('KeywordHistory') === null ? [] : 
           localStorage.getItem('KeywordHistory').split(',');
    }


    setState(nextData) {
    this.data = nextData;
    this.render();
    }

    bindEvent() {
      this.$KeywordHistory.querySelectorAll('li button').forEach(
        ($item, index) => {
        $item.addEventListener('click', () => {
          console.log(this.data[index]);
          this.onSearch(this.data[index]);
        });
    });
    }

    render() {
        this.$KeywordHistory.innerHTML = this.data
         .map(
            keyword => `
            <li><button>${keyword}</button></li>
            `
         ).join(''); 
        
       this.bindEvent();

       }
    }

    export default KeywordHistory;