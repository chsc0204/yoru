// ===== 곡 데모 데이터 (40곡, 아티스트당 2곡) =====
// YouTube 링크는 실제 영상 하나를 특정해 연결하지 않고, 항상 유효하게 열리는
// "아티스트 + 곡명" 검색 결과 페이지로 연결합니다 (youtubeSearchUrl, utils.js 참고).
const SONGS = [
  { id: 'yoasobi-yorunikakeru', title: '夜に駆ける', reading: 'Yoru ni Kakeru', translatedTitle: '밤을 달리다', artistId: 'yoasobi', albumId: 'yoasobi-thebook', releaseDate: '2019-11-15', genre: 'J-Pop', popularity: 98 },
  { id: 'yoasobi-idol', title: 'アイドル', reading: 'Idol', translatedTitle: '아이돌', artistId: 'yoasobi', albumId: 'yoasobi-thebook', releaseDate: '2023-04-12', genre: 'J-Pop', popularity: 97 },

  { id: 'ado-usseewa', title: 'うっせぇわ', reading: 'Usseewa', translatedTitle: '시끄러워', artistId: 'ado', albumId: 'ado-zanmu', releaseDate: '2020-10-23', genre: 'J-Pop', popularity: 96 },
  { id: 'ado-shou', title: '唱', reading: 'Shou', translatedTitle: '노래(唱)', artistId: 'ado', albumId: 'ado-zanmu', releaseDate: '2022-05-20', genre: 'J-Pop', popularity: 93 },

  { id: 'kenshi-lemon', title: 'Lemon', reading: 'Lemon', translatedTitle: '레몬', artistId: 'kenshi-yonezu', albumId: 'kenshi-straysheep', releaseDate: '2018-03-14', genre: 'J-Pop', popularity: 97 },
  { id: 'kenshi-kickback', title: 'KICK BACK', reading: 'Kick Back', translatedTitle: '킥 백', artistId: 'kenshi-yonezu', albumId: 'kenshi-straysheep', releaseDate: '2022-10-12', genre: 'J-Pop', popularity: 95 },

  { id: 'fujii-nannan', title: '何なんw', reading: 'Nan-nan', translatedTitle: '뭐야(w)', artistId: 'fujii-kaze', albumId: 'fujii-helpeverhurtnever', releaseDate: '2020-05-19', genre: 'Soul', popularity: 91 },
  { id: 'fujii-hana', title: '花', reading: 'Hana', translatedTitle: '꽃', artistId: 'fujii-kaze', albumId: 'fujii-helpeverhurtnever', releaseDate: '2020-11-11', genre: 'Soul', popularity: 89 },

  { id: 'higedan-pretender', title: 'Pretender', reading: 'Pretender', translatedTitle: '프리텐더', artistId: 'official-higedandism', albumId: 'higedan-traveler', releaseDate: '2019-05-01', genre: 'Rock', popularity: 95 },
  { id: 'higedan-subtitle', title: 'Subtitle', reading: 'Subtitle', translatedTitle: '서브타이틀', artistId: 'official-higedandism', albumId: 'higedan-traveler', releaseDate: '2021-01-27', genre: 'Rock', popularity: 92 },

  { id: 'mga-dancehall', title: 'ダンスホール', reading: 'Dance Hall', translatedTitle: '댄스홀', artistId: 'mrs-green-apple', albumId: 'mga-antenna', releaseDate: '2021-11-10', genre: 'Rock', popularity: 93 },
  { id: 'mga-queserasera', title: 'ケセラセラ', reading: 'Que Sera Sera', translatedTitle: '케세라세라', artistId: 'mrs-green-apple', albumId: 'mga-antenna', releaseDate: '2022-02-16', genre: 'Rock', popularity: 90 },

  { id: 'kinggnu-hakujitsu', title: '白日', reading: 'Hakujitsu', translatedTitle: '백일', artistId: 'king-gnu', albumId: 'kinggnu-ceremony', releaseDate: '2019-03-25', genre: 'Alternative', popularity: 89 },
  { id: 'kinggnu-flash', title: 'Flash!!!', reading: 'Flash!!!', translatedTitle: '플래시!!!', artistId: 'king-gnu', albumId: 'kinggnu-ceremony', releaseDate: '2021-01-08', genre: 'Alternative', popularity: 85 },

  { id: 'vaundy-kaijuu', title: '怪獣の花唄', reading: 'Kaijuu no Hanauta', translatedTitle: '괴수의 꽃노래', artistId: 'vaundy', albumId: 'vaundy-strobo', releaseDate: '2020-04-24', genre: 'Alternative', popularity: 90 },
  { id: 'vaundy-tokyoflash', title: '東京フラッシュ', reading: 'Tokyo Flash', translatedTitle: '도쿄 플래시', artistId: 'vaundy', albumId: 'vaundy-strobo', releaseDate: '2021-06-16', genre: 'Alternative', popularity: 85 },

  { id: 'backnumber-christmassong', title: 'クリスマスソング', reading: 'Christmas Song', translatedTitle: '크리스마스 송', artistId: 'back-number', albumId: 'backnumber-encore', releaseDate: '2013-11-06', genre: 'Ballad', popularity: 84 },
  { id: 'backnumber-takanenohanako', title: '高嶺の花子さん', reading: 'Takane no Hanako-san', translatedTitle: '다카네의 하나코 씨', artistId: 'back-number', albumId: 'backnumber-encore', releaseDate: '2013-01-23', genre: 'Ballad', popularity: 82 },

  { id: 'aimyon-marigold', title: 'マリーゴールド', reading: 'Marigold', translatedTitle: '메리골드', artistId: 'aimyon', albumId: 'aimyon-shunkantekisixsense', releaseDate: '2018-04-11', genre: 'Ballad', popularity: 88 },
  { id: 'aimyon-aiwotsutaetai', title: '愛を伝えたいだとか', reading: 'Ai wo Tsutaetai Datoka', translatedTitle: '사랑을 전하고 싶다든가', artistId: 'aimyon', albumId: 'aimyon-shunkantekisixsense', releaseDate: '2017-11-08', genre: 'Ballad', popularity: 83 },

  { id: 'lisa-gurenge', title: '紅蓮華', reading: 'Gurenge', translatedTitle: '홍련화', artistId: 'lisa', albumId: 'lisa-leonine', releaseDate: '2019-07-03', genre: 'Anime Song', popularity: 92 },
  { id: 'lisa-homura', title: '炎', reading: 'Homura', translatedTitle: '불꽃', artistId: 'lisa', albumId: 'lisa-leonine', releaseDate: '2020-10-14', genre: 'Anime Song', popularity: 90 },

  { id: 'eve-kaikaikitan', title: '廻廻奇譚', reading: 'Kaikai Kitan', translatedTitle: '회회기담', artistId: 'eve', albumId: 'eve-smile', releaseDate: '2020-12-04', genre: 'Alternative', popularity: 88 },
  { id: 'eve-kumonoito', title: '蜘蛛の糸', reading: 'Kumo no Ito', translatedTitle: '거미줄', artistId: 'eve', albumId: 'eve-smile', releaseDate: '2019-05-08', genre: 'Alternative', popularity: 80 },

  { id: 'yorushika-dakarabokuha', title: 'だから僕は音楽を辞めた', reading: 'Dakara Boku wa Ongaku wo Yameta', translatedTitle: '그래서 나는 음악을 그만뒀다', artistId: 'yorushika', albumId: 'yorushika-makeinu', releaseDate: '2019-01-16', genre: 'Rock', popularity: 84 },
  { id: 'yorushika-hananibourei', title: '花に亡霊', reading: 'Hana ni Bourei', translatedTitle: '꽃에 깃든 망령', artistId: 'yorushika', albumId: 'yorushika-makeinu', releaseDate: '2021-05-19', genre: 'Rock', popularity: 82 },

  { id: 'radwimps-zenzenzense', title: '前前前世', reading: 'Zenzenzense', translatedTitle: '전전전세', artistId: 'radwimps', albumId: 'radwimps-ningenkaika', releaseDate: '2016-08-24', genre: 'Rock', popularity: 91 },
  { id: 'radwimps-sparkle', title: 'スパークル', reading: 'Sparkle', translatedTitle: '스파클', artistId: 'radwimps', albumId: 'radwimps-ningenkaika', releaseDate: '2016-08-24', genre: 'Rock', popularity: 87 },

  { id: 'sekaowa-rpg', title: 'RPG', reading: 'RPG', translatedTitle: 'RPG', artistId: 'sekai-no-owari', albumId: 'sekaowa-tree', releaseDate: '2015-12-09', genre: 'J-Pop', popularity: 84 },
  { id: 'sekaowa-honootomori', title: '炎と森のカーニバル', reading: 'Honoo to Mori no Carnival', translatedTitle: '불과 숲의 카니발', artistId: 'sekai-no-owari', albumId: 'sekaowa-tree', releaseDate: '2010-11-10', genre: 'J-Pop', popularity: 78 },

  { id: 'zutomayo-byoushin', title: '秒針を噛む', reading: 'Byoushin wo Kamu', translatedTitle: '초침을 물다', artistId: 'zutomayo', albumId: 'zutomayo-ananonym', releaseDate: '2019-05-15', genre: 'Alternative', popularity: 81 },
  { id: 'zutomayo-aitsurazenin', title: 'あいつら全員同窓会', reading: 'Aitsura Zenin Doukyuukai', translatedTitle: '그놈들 전원 동창회', artistId: 'zutomayo', albumId: 'zutomayo-ananonym', releaseDate: '2020-02-05', genre: 'Alternative', popularity: 77 },

  { id: 'perfume-polyrhythm', title: 'ポリリズム', reading: 'Polyrhythm', translatedTitle: '폴리리듬', artistId: 'perfume', albumId: 'perfume-game', releaseDate: '2007-10-10', genre: 'Electropop', popularity: 80 },
  { id: 'perfume-chocolatedisco', title: 'チョコレイト・ディスコ', reading: 'Chocolate Disco', translatedTitle: '초콜릿 디스코', artistId: 'perfume', albumId: 'perfume-game', releaseDate: '2007-01-24', genre: 'Electropop', popularity: 77 },

  { id: 'babymetal-gimmechocolate', title: 'ギミチョコ!!', reading: 'Gimme Chocolate!!', translatedTitle: '기미쇼콜라!!', artistId: 'babymetal', albumId: 'babymetal-metalresistance', releaseDate: '2012-09-26', genre: 'Metal', popularity: 82 },
  { id: 'babymetal-headbanger', title: 'ヘドバンギャー!!', reading: 'Headbangeeeeerrrrr!!', translatedTitle: '헤드뱅어!!', artistId: 'babymetal', albumId: 'babymetal-metalresistance', releaseDate: '2013-03-27', genre: 'Metal', popularity: 78 },

  { id: 'aimer-kataomoi', title: 'カタオモイ', reading: 'Kataomoi', translatedTitle: '짝사랑', artistId: 'aimer', albumId: 'aimer-sundance', releaseDate: '2016-10-26', genre: 'Ballad', popularity: 86 },
  { id: 'aimer-refrain', title: 'Ref:rain', reading: 'Ref:rain', translatedTitle: '레프레인', artistId: 'aimer', albumId: 'aimer-sundance', releaseDate: '2017-01-25', genre: 'Ballad', popularity: 82 },

  { id: 'milet-insideyou', title: 'inside you', reading: 'inside you', translatedTitle: '인사이드 유', artistId: 'milet', albumId: 'milet-eyes', releaseDate: '2020-09-16', genre: 'Anime Song', popularity: 80 },
  { id: 'milet-flyhigh', title: 'Fly High', reading: 'Fly High', translatedTitle: '플라이 하이', artistId: 'milet', albumId: 'milet-eyes', releaseDate: '2021-04-07', genre: 'Anime Song', popularity: 77 },
];
