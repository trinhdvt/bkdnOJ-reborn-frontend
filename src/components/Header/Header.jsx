import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import flag from 'assets/images/bkdnoj-dropflag.png';
import './Header.scss';

export default class Header extends React.Component {
    bugsReportClick() {
        const msg = "Đây là phiên bản thử nghiệm của bkdnOJ v2.0, "+
        "nên chắc chắn sẽ tồn tại bugs ở nhiều hình thái. Mong nhận được sự thông cảm của mọi người.\n\n"+
        "Để báo cáo bugs, các bạn có thể gửi email đến `lambda.nvat@gmail.com`, đính kèm ảnh/video bug, "+
        "mô tả bug, nêu những bước để tái hiện bug đó. Ngoài ra, các bạn còn có thể tạo issue tại "+
        "Github của project.\n\nBạn có thể lấy link github và email ở bên dưới Footer, hoặc ở trong console "+
        "trình duyệt. Xin cảm ơn các bạn.";
        const email = "lambda.nvat@gmail.com";
        const github = "https://github.com/BKDN-University/bkdnOJ-reborn-frontend/issues";

        console.log(`Email to:\n ${email}`);
        console.log(`Create Github issue here:\n ${github}`);

        alert(msg);
    }

    render() {

        return (
            <div className='header'>
                <Container>
                    <div className='site-logo d-none d-md-block'>
                        <Link to="/">
                            <img src={flag} alt="Drop down Flag with BKDN icon and Online Judge text" />
                        </Link>
                    </div>
                    <span>bkdnOJ v2.0</span>
                    <span>pre-ALPHA</span>
                    {/* <span>Bugs are to be expected, please report them to lambda.nvat@gmail.com</span> */}
                    {/* <span>🇻🇳 Tiếng Việt</span>
                    <span>🇬🇧 English</span> */}
                    <span className="bugs" onClick={() => this.bugsReportClick()}>Bugs 🐞</span>
                </Container>
            </div>
        )
    }
}
