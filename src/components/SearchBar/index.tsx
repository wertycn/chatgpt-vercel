import { Component } from 'solid-js'
import './styles.css'

const SearchBar: Component = () => {
  const search = () => {
    const engine = document.querySelector('input[name="search-engine"]:checked') as HTMLInputElement
    const query = (document.getElementById('search-box') as HTMLInputElement).value
    let url = ''

    switch (engine.value) {
      case 'Ai':
        url = 'https://www.cosmoplat.cn/q?wd=' + encodeURIComponent(query)
        break
      case '百度':
        url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(query)
        break
      case '微软':
        url = 'https://www.bing.com/search?q=' + encodeURIComponent(query)
        break
      case '谷歌':
        url = 'https://llllo.cn/s?q=' + encodeURIComponent(query)
        break
      case '哔站':
        url = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(query)
        break
      case '抖音':
        url = 'https://www.douyin.com/search/' + encodeURIComponent(query)
        break
      case '软件':
        url = 'https://www.423down.com/search/' + encodeURIComponent(query)
        break
      case '电影':
        url = 'http://bd.x258.com/so.php?' + encodeURIComponent(query)
        break
      case '爱腾优':
        url = 'http://bd.x258.com/aty.php?https://video.isyour.love/Search/SearchName/' + encodeURIComponent(query)
        break
      default:
        url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(query)
    }

    window.open(url, '_blank')
  }

  const enterKeyPressed = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      search()
      return false
    }
  }

  const toggleClearButton = () => {
    const searchBox = document.getElementById('search-box') as HTMLInputElement
    const clearButton = document.querySelector('.clear-button') as HTMLElement
    if (searchBox?.value.length > 0) {
      clearButton?.style.setProperty('display', 'inline-block')
    } else {
      clearButton?.style.setProperty('display', 'none')
    }
  }

  const clearSearchBox = () => {
    const searchBox = document.getElementById('search-box') as HTMLInputElement
    searchBox.value = ''
    toggleClearButton()
  }

  return (
    <div class="search-container">
      <label>
        <input type="radio" name="search-engine" value="百度" checked /> 
        <img src="https://www.baidu.com/img/flexible/logo/pc/result.png" width="67" height="22" />
      </label>
      <label>
        <input type="radio" name="search-engine" value="谷歌" />
        <img src="http://bd.x258.com/google.png" width="52" height="20" />
      </label>
      <label>
        <input type="radio" name="search-engine" value="微软" />
        <img src="http://bd.x258.com/bing.png" width="53" height="20" />
      </label>
      <label>
        <input type="radio" name="search-engine" value="哔站" />
        <img src="https://s1.hdslb.com/bfs/static/jinkela/long/mstation/logo-bilibili-pink.png@132w_60h_1c.webp" width="44" height="20" />
      </label>
      <label>
        <input type="radio" name="search-engine" value="抖音" />
        <img src="https://pp.myapp.com/ma_icon/0/icon_42350811_1722938682/256" width="20" height="20" />
      </label>
      <label>
        <input type="radio" name="search-engine" value="爱腾优" />
        <span class="video-icons">
          <img src="https://pp.myapp.com/ma_icon/0/icon_7720_1722045384/256" width="20" height="20" />
          <img src="https://pc3.gtimg.com/softmgr/logo/48/31865_48_1686555263.png" width="20" height="20" />
          <img src="https://pp.myapp.com/ma_icon/0/icon_73622_1726043193/256" width="19" height="19" />
          <img src="http://bd.x258.com/pojie.png" width="12" height="24" />
        </span>
      </label>
      <label>
        <input type="radio" name="search-engine" value="电影" />
        影视下载<img src="http://bd.x258.com/pojie.png" width="12" height="24" />
      </label>
      <label>
        <input type="radio" name="search-engine" value="软件" />
        软件<img src="http://bd.x258.com/pojie.png" width="12" height="24" />
      </label>
      
      <div class="search-input-container">
        <input 
          type="text" 
          id="search-box" 
          class="search-input" 
          placeholder="请输入搜索内容"
          onKeyPress={enterKeyPressed}
          onInput={toggleClearButton}
        />
        <button type="button" class="search-button" onClick={search}>
          搜索
        </button>
        <span class="clear-button" onClick={clearSearchBox}>×</span>
      </div>
    </div>
  )
}

export default SearchBar 