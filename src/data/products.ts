export interface ProductHamper {
  id: string;
  name: string;
  subTitle: string;
  theme: string;
  badge: string;
  image: string;
  bannerImage: string;
  description: string;
  highlights: string[];
  components: string[];
  packagingDetails: string[];
  recommendedFor: string;
}

export const BRAND_INFO = {
  name: 'VINEYARD.VN',
  slogan: 'THE KING OF WINES',
  parentCompany: 'BINH MINH GROUP – FOODS & DRINKS',
  website: 'https://vineyard.vn/',
  hotline: '091 100 22 33',
  hotlineRaw: '0911002233',
  zalo: '091 100 22 33',
  zaloLink: 'https://zalo.me/0911002233',
  email: 'baogia@vineyard.vn',
  address: '10 Truong Dinh Hoi Str., Ward 16, District 8, Ho Chi Minh City, Vietnam.',
  logoVineyard: '/assets/aistudio/2_logo_nhieu_mau-01_453faceb.jpg',
  logoBinhMinh: '/assets/aistudio/378322_cd712a19.png',
};

export const PRODUCTS: ProductHamper[] = [
  {
    id: 'hamper-golden-prosperity',
    name: 'HAMPER GOLDEN PROSPERITY',
    subTitle: 'Hộp Quà Hạc An Khang – Vàng Son Thịnh Vượng',
    theme: 'Hoàng Kim & Phong Thủy',
    badge: 'Mẫu Hoàng Gia Vàng Son',
    image: '/assets/aistudio/1_81b8582e.png',
    bannerImage: '/assets/aistudio/H_p_Qu__T_t_H_c_An_Khang_V_ng_Son_2e65bb4c.png',
    description: 'Hộp quà Vineyard màu vàng kim dập nổi 3D tinh xảo, khắc họa biểu tượng chim hạc an khang sải cánh, hoa đào nghinh xuân và thuyền buồm thuận buồm xuôi gió trên sóng biếc.',
    highlights: [
      'Biểu tượng Chim Hạc An Khang & Trường Thọ',
      'Họa tiết Thuyền Buồm Thuận Buồm Xuôi Gió',
      'Công nghệ dập nổi 3D ép kim ánh vàng hoàng gia',
      'Khắc họa sắc nét logo vương miện Vineyard'
    ],
    components: [
      'Rượu vang hảo hạng tuyển chọn độc quyền từ Vineyard',
      'Bộ phụ kiện khui rượu vang chuyên nghiệp',
      'Hộp cứng cao cấp tráng kim dập nổi đa tầng',
      'Túi xách cao cấp đồng bộ cùng tông màu'
    ],
    packagingDetails: [
      'Kích thước hộp đứng sang trọng, chắc chắn',
      'Khóa nam châm và bản lề gia công tỉ mỉ',
      'Bề mặt phủ kim dập nổi hoa văn mây lành cát tường',
      'Có sẵn vị trí tùy biến ép kim logo doanh nghiệp'
    ],
    recommendedFor: 'Tặng đối tác chiến lược, hội đồng quản trị, khách hàng VIP'
  },
  {
    id: 'hamper-oriental-celebration',
    name: 'HAMPER ORIENTAL CELEBRATION',
    subTitle: 'Hộp Quà Hoa Khai Phú – Sắc Đỏ Phú Quý',
    theme: 'Truyền Thống & Hiện Đại',
    badge: 'Được Yêu Thích Nhất',
    image: '/assets/aistudio/4_ae98fb1a.png',
    bannerImage: '/assets/aistudio/H_p_Qu__T_t_Hoa_Khai_Ph__Sang_Tr_ng_a04f6789.png',
    description: 'Hộp quà Vineyard sắc đỏ lễ hội với quai xách bọc da sang trọng, họa tiết hoa mẫu đơn phú quý, chim én thanh tao cùng cửa sổ mở hé lộ trọn vẹn bộ quà tặng cao cấp bên trong.',
    highlights: [
      'Quai xách da thời thượng, thuận tiện mang trao tặng',
      'Họa tiết Hoa Mẫu Đơn & Chim Én Báo Xuân ngập tràn sắc Tết',
      'Thiết kế cửa sổ mở trưng bày trực quan sản phẩm',
      'Bộ quà đa dạng kết hợp rượu vang và hạt bánh hảo hạng'
    ],
    components: [
      'Vang Ý cao cấp R7 Gold Primitivo (Top 100 danh giá)',
      'Chocolate Assortment cao cấp hương vị nguyên bản',
      'Hạt dẻ nướng Roasted Chestnuts thơm bùi tự nhiên',
      'Bánh quy bơ giòn Butter Cookies nhập khẩu chọn lọc',
      'Hộp quà có quai xách thiết kế đồng bộ ấn tượng'
    ],
    packagingDetails: [
      'Chất liệu hộp cứng dày dặn định lượng cao',
      'Quai cầm tán đinh kim loại ánh vàng sang trọng',
      'Khay định hình bọc nhung nâng đỡ từng sản phẩm',
      'Bề mặt in phủ UV định hình sắc nét từng cánh hoa'
    ],
    recommendedFor: 'Tặng khách hàng thân thiết, đối tác kinh doanh, ban điều hành'
  },
  {
    id: 'hamper-marquis-xo',
    name: 'HAMPER MARQUIS XO',
    subTitle: 'Hộp Quà Marquis III XO French Brandy – Phong Thái Quý Tộc',
    theme: 'Đẳng Cấp Châu Âu',
    badge: 'Bộ Sưu Tập Giới Hạn',
    image: '/assets/aistudio/3_aed9879a.png',
    bannerImage: '/assets/aistudio/Hamper_T_t_Ho_ng_Gia_Vineyard.vn_3171d4b5.png',
    description: 'Tuyệt tác hộp quà phong cách Hoàng Gia Châu Âu với tông màu champagne quý phái và đỏ burgundy vương giả, họa tiết kỵ sĩ cưỡi chiến mã dũng mãnh và vương miện mặt trời dập nổi sắc sảo.',
    highlights: [
      'Họa tiết Kỵ Sĩ Hoàng Gia & Mặt Trời Huy Hoàng',
      'Tông màu Champagne & Đỏ Burgundy vương giả',
      'Biểu trưng cho bản lĩnh kiên cường và thắng lợi kinh doanh',
      'Dòng Brandy Pháp XO thượng hạng khẳng định vị thế'
    ],
    components: [
      'Rượu Marquis III French Brandy XO hảo hạng từ Pháp (5 sao)',
      'Bộ ly pha lê thưởng rượu cao cấp (tùy chọn set)',
      'Hộp quà phong cách cánh cửa đôi độc đáo',
      'Túi quà Hoàng Gia thiết kế riêng'
    ],
    packagingDetails: [
      'Hộp đóng mở nam châm cao cấp với độ khít hoàn hảo',
      'Lót lụa nhung đỏ tôn vinh sắc vàng ánh kim của chai rượu',
      'Họa tiết dập nổi 3D chạm trổ hoa văn Baroque cầu kỳ',
      'Tem niêm phong bảo an chính hãng'
    ],
    recommendedFor: 'Tặng lãnh đạo cấp cao, đối tác ngoại giao, khách hàng đặc biệt'
  },
  {
    id: 'hamper-label-5-red',
    name: 'HAMPER LABEL 5 RED',
    subTitle: 'Hộp Quà Scotch Whisky Label 5 Sắc Đỏ – Cá Chép Hóa Rồng',
    theme: 'Cát Tường & Tài Lộc',
    badge: 'Bestseller Doanh Nghiệp',
    image: '/assets/aistudio/2_78bd844e.png',
    bannerImage: '/assets/aistudio/Hamper_T_t_Label_5____Sang_Tr_ng_cada9040.png',
    description: 'Hộp quà Label 5 sắc đỏ cát tường với họa tiết song ngư cá chép vượt vũ môn ép kim 3D sống động, số 5 vàng son cách điệu lộng lẫy cùng sự kết hợp trọn vẹn của Scotch Whisky và đồ ngọt thượng hạng.',
    highlights: [
      'Họa tiết Song Ngư Quần Tụ mang ý nghĩa thăng tiến',
      'Số 5 may mắn biểu trưng Ngũ Phúc Lâm Môn',
      'Hộp quà mở đôi kèm set hạt, chocolate và bánh hảo hạng',
      'Quai xách tiện dụng phủ nhũ vàng sang trọng'
    ],
    components: [
      'Chai Blended Scotch Whisky Label 5 Classic Black Matured in Oak Casks',
      'Hộp Chocolate Assortment cao cấp',
      'Hộp Hạt Dẻ Nướng Roasted Chestnuts chọn lọc',
      'Hộp Bánh Quy Bơ Butter Cookies truyền thống',
      'Hộp quà có quai xách vàng son tích hợp sang trọng'
    ],
    packagingDetails: [
      'Thiết kế dạng hộp mở kèm khay giữ chắc chắn từng hộp con',
      'Mặt trong in logo thương hiệu ép kim sắc nét',
      'Lót nhung đỏ bảo vệ sản phẩm khi vận chuyển xa',
      'Quai xách tán đinh gia cố chịu lực tốt'
    ],
    recommendedFor: 'Quà tặng cán bộ nhân viên xuất sắc, khách hàng doanh nghiệp thân thiết'
  },
  {
    id: 'hamper-label-5-green',
    name: 'HAMPER LABEL 5 GREEN',
    subTitle: 'Hộp Quà Scotch Whisky Label 5 Xanh – Khởi Sắc Tươi Mới',
    theme: 'Thanh Mát & Đột Phá',
    badge: 'Hương Vị Độc Đáo',
    image: '/assets/aistudio/5_e07411b8.png',
    bannerImage: '/assets/aistudio/Hamper_Label_5_Xanh_Sang_Tr_ng_16291da7.png',
    description: 'Phiên bản xanh lục bảo mang năng lượng đổi mới và phát triển bền vững, họa tiết song ngư vờn hoa quả cam chanh Citrus dập nổi tinh xảo, kết hợp dòng rượu Whisky hương vị thảo mộc tươi mát.',
    highlights: [
      'Tông màu Xanh Lục Bảo phong thủy Mộc sinh Hỏa cát tường',
      'Hương vị Citrus thanh mát tự nhiên từ Chanh, Cam Bergamot',
      'Họa tiết Song Ngư may mắn mạ vàng kim ấn tượng',
      'Sự lựa chọn hiện đại cho các doanh nghiệp trẻ, năng động'
    ],
    components: [
      'Label 5 Original Citrus Spirit Drink (Scotch Whisky thảo mộc tự nhiên)',
      'Hộp cứng cao cấp dập nổi ánh kim xanh lục bảo',
      'Bộ ly uống cocktail / on-the-rocks đi kèm (theo cấu hình đơn hàng)',
      'Túi xách cao cấp đồng bộ'
    ],
    packagingDetails: [
      'Họa tiết dập nổi 3D đa tầng trên nền xanh nhung',
      'Gia công mép gập không nếp gấp sắc sảo',
      'Chất liệu thân thiện với môi trường, bền đẹp dài lâu',
      'Bề mặt chống bám vân tay cao cấp'
    ],
    recommendedFor: 'Doanh nghiệp công nghệ, dịch vụ sáng tạo, đối tác trẻ năng động'
  }
];

export const CORPORATE_PILLARS = [
  {
    id: 'pillar-1',
    step: '01',
    title: 'Quà Tặng Đối Tác & Khách Hàng',
    description: 'Tuyển chọn những dòng rượu vang và rượu mạnh nhập khẩu chính ngạch danh tiếng, khẳng định vị thế và sự tôn vinh trọn vẹn dành cho người nhận.',
    icon: 'Crown'
  },
  {
    id: 'pillar-2',
    step: '02',
    title: 'Cá Nhân Hóa & In Logo Doanh Nghiệp',
    description: 'Hỗ trợ thiết kế và ép kim logo, in thiệp chúc mừng riêng mang nhận diện thương hiệu doanh nghiệp trên từng hộp quà.',
    icon: 'Sparkles'
  },
  {
    id: 'pillar-3',
    step: '03',
    title: 'Đáp Ứng Đơn Hàng Số Lượng Lớn',
    description: 'Năng lực cung ứng linh hoạt từ 50 đến hơn 1.000 hộp quà với chất lượng đồng nhất, kiểm định nghiêm ngặt trước khi xuất xưởng.',
    icon: 'Boxes'
  },
  {
    id: 'pillar-4',
    step: '04',
    title: 'Giao Hàng An Toàn Toàn Quốc',
    description: 'Quy trình đóng gói chống sốc tiêu chuẩn, giao tận nơi theo danh sách phân bổ của doanh nghiệp đúng tiến độ cam kết.',
    icon: 'Truck'
  }
];

export const BULK_TIERS = [
  {
    tier: '50+ HỘP',
    sub: 'Quy mô Khởi điểm',
    target: 'Doanh nghiệp vừa và nhỏ, phòng ban, tri ân đối tác nòng cốt',
    benefits: [
      'Tư vấn phối trộn sản phẩm theo ngân sách',
      'Tặng kèm thiệp chúc mừng thiết kế tiêu chuẩn',
      'Hỗ trợ đóng gói an toàn và giao hàng tập trung'
    ]
  },
  {
    tier: '100+ HỘP',
    sub: 'Quy mô Phổ biến',
    target: 'Doanh nghiệp tri ân mạng lưới khách hàng và đại lý',
    benefits: [
      'Chính sách chiết khấu bậc thang theo số lượng',
      'Hỗ trợ in ấn thiệp chúc mừng mang dấu ấn công ty',
      'Ưu tiên phân bổ tiến độ giao hàng trước Tết'
    ]
  },
  {
    tier: '500+ HỘP',
    sub: 'Quy mô Doanh nghiệp lớn',
    target: 'Tập đoàn, ngân hàng, công ty bất động sản, chuỗi bán lẻ',
    benefits: [
      'Chính sách giá đặc quyền doanh nghiệp',
      'Cá nhân hóa ép kim logo doanh nghiệp lên hộp quà',
      'Hỗ trợ phân chia và giao hàng theo danh sách đa điểm'
    ]
  },
  {
    tier: '1.000+ HỘP',
    sub: 'Quy mô Đại dự án',
    target: 'Tổng công ty, tập đoàn đa quốc gia, chương trình quà tặng trọng điểm',
    benefits: [
      'Tư vấn thiết kế bao bì và bộ nhận diện độc quyền',
      'Chuyên viên dự án phục vụ 24/7 theo dõi từ A-Z',
      'Kế hoạch lưu kho và giao hàng linh hoạt theo nhiều đợt'
    ]
  }
];

export const ORDERING_STEPS = [
  {
    step: '01',
    title: 'Gửi Yêu Cầu Báo Giá',
    desc: 'Doanh nghiệp điền biểu mẫu hoặc liên hệ Hotline/Zalo cung cấp số lượng dự kiến và sản phẩm quan tâm.'
  },
  {
    step: '02',
    title: 'Vineyard Tiếp Nhận & Tư Vấn',
    desc: 'Đội ngũ chuyên viên B2B phản hồi nhanh, gửi bảng báo giá chi tiết và gợi ý giải pháp quà tặng tối ưu.'
  },
  {
    step: '03',
    title: 'Xác Nhận Sản Phẩm & Số Lượng',
    desc: 'Thống nhất mẫu mã, thành phần trong hộp, nội dung in logo hoặc thiệp chúc mừng đi kèm.'
  },
  {
    step: '04',
    title: 'Thống Nhất Báo Giá & Hợp Đồng',
    desc: 'Ký kết thỏa thuận cung cấp, xác nhận hóa đơn VAT doanh nghiệp và phương thức thanh toán.'
  },
  {
    step: '05',
    title: 'Chuẩn Bị & Giao Hàng',
    desc: 'Gia công đóng gói chuẩn hóa, kiểm định chất lượng và giao hàng tận nơi trên toàn quốc.'
  }
];

export const FAQ_LIST = [
  {
    q: 'Vineyard.vn có nhận đơn hàng quà Tết số lượng lớn không?',
    a: 'Có. Chúng tôi chuyên cung ứng các đơn hàng quà Tết doanh nghiệp quy mô từ 50 hộp đến trên 1.000 hộp, đảm bảo năng lực cung ứng kịp thời, chất lượng đồng đều và hóa đơn chứng từ đầy đủ.'
  },
  {
    q: 'Doanh nghiệp có thể in logo lên hộp quà không?',
    a: 'Có. Vineyard.vn cung cấp dịch vụ cá nhân hóa như ép kim logo doanh nghiệp lên vỏ hộp, nơ ruy băng hoặc in thiệp chúc Tết đính kèm theo yêu cầu của từng doanh nghiệp.'
  },
  {
    q: 'Có chính sách chiết khấu khi đặt nhiều hộp quà không?',
    a: 'Có. Chúng tôi áp dụng chính sách chiết khấu thương mại bậc thang hấp dẫn dành riêng cho khách hàng doanh nghiệp đặt hàng số lượng lớn. Quý khách vui lòng gửi yêu cầu để nhận bảng chiết khấu chi tiết theo từng mức sản lượng.'
  },
  {
    q: 'Vineyard.vn có giao hàng toàn quốc không?',
    a: 'Có. Chúng tôi hỗ trợ vận chuyển an toàn trên toàn quốc, có quy cách đóng thùng bảo vệ chuyên dụng chống va đập và hỗ trợ phân bổ giao đến các chi nhánh của doanh nghiệp.'
  },
  {
    q: 'Làm thế nào để nhận báo giá nhanh nhất?',
    a: 'Quý doanh nghiệp có thể gửi biểu mẫu đăng ký nhận báo giá tại chân trang web này, gọi trực tiếp Hotline 091 100 22 33 hoặc kết nối Zalo 091 100 22 33 để được tư vấn viên hỗ trợ trong thời gian sớm nhất.'
  },
  {
    q: 'Doanh nghiệp có thể yêu cầu thiết kế quà tặng riêng không?',
    a: 'Có. Với các đơn hàng lớn hoặc nhu cầu đặc thù, đội ngũ Vineyard.vn sẵn sàng tư vấn tùy chỉnh thành phần rượu, bánh kẹo, hoa văn bao bì để phù hợp hoàn hảo với ngân sách và nhận diện của doanh nghiệp.'
  }
];
