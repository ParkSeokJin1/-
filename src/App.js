console.log("app is running!");
import api from './api.js';
import Loading from './Loading.js';
import DarkModeToggle from './DarkModeToggle.js';
import SearchInput from './SearchInput.js';
import SearchResult from './SearchResult.js';
import ImageInfo from './ImageInfo.js';
import Banner from './Banner.js';


class App {
  $target = null;
  DEFAULT_PAGE = 1;
  data = {
    items: [],
    page: this.DEFAULT_PAGE
  }


  constructor($target) {
    this.$target = $target;
    
    this.Loading = new Loading({
      $target,
    });


    this.DarkModeToggle = new DarkModeToggle({
      $target,
     // onSearch: keyword => {
      //  api.fetchCats(keyword).then(({ data }) => this.setState(data));
     // }
    });


  


    this.searchInput = new SearchInput({
      $target,
      onSearch: (keyword, limit) => {
        // 로딩 show
        this.Loading.show();
        api.fetchCatsWithLimit(keyword, limit).then(({ data }) => {
          this.setState({
           items: data,
           page : this.DEFAULT_PAGE
          });
        // 로딩 hidden
        this.Loading.hide();
        // 로컬에 저장 
        this.saveResult(data);
      });
    },

   



    //랜덤 고양이 버튼을 눌렀을 때 실행되는 데이터 
     onRandomSearch: () => {
      this.Loading.show();
      api.fetchRandomCats().then(({data}) => {
        this.setState({
          items: data,
          page: this.DEFAULT_PAGE
        });
        this.Loading.hide();
      });
     }
    });

    this.banner = new Banner({
      $target
    })


    this.searchResult = new SearchResult({
      $target,
      initialData: this.data.items,
      onClick: cat => {
        this.imageInfo.showDetail({
          visible: true,
          cat
        });
      },
      onNextPage: () => {
        this.Loading.show();
        const KeywordHistory = localStorage.getItem('KeywordHistory') === null ? [] : 
        localStorage.getItem('KeywordHistory').split(',');
        const lastKeyword = KeywordHistory[0];
        const page = this.data.page + 1;
        api.fetchCatsPage(lastKeyword, page).then(({ data }) => {
          let newData = this.data.items.concat(data); // 기존데이터에 새로운 데이터 연결
         this.setState({
          items: newData,
          page : page
        });
        this.Loading.hide();
      
      });
      }
    });

    this.imageInfo = new ImageInfo({
      $target,
      data: {
        visible: false,
        image: null
      }
    });
    this.init();
  }

  setState(nextData) {
    this.data = nextData;
    this.searchResult.setState(nextData.items);
  }

  saveResult(result) { // result 는 data 임
    localStorage.setItem('lastResult', JSON.stringify(result)); // 배열이나 object를 스트링타입으로 만들어줌
  }

  init() {
    const lastResult = localStorage.getItem('lastResult') === null 
    ? [] :  JSON.parse(localStorage.getItem('lastResult')); // parse를 통해 자바스크립트로 다시 변경 
    this.setState({
      items: lastResult,
      page: this.DEFAULT_PAGE
    });
  }

  
}


export default App;