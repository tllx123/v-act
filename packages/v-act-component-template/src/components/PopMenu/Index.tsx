import * as React from "react";
import Button from '@mui/material/Button';
import Menu  from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from './styles/PopMenu.module.css';


function PopMenu(props: {title:string, menus: Array<{ code: string, title: string }>, handleClick: (code: string) => void }) {
    const {menus,title,handleClick} = props;
    const [skinEl, setSkinEl] = React.useState<null | HTMLElement>(null);
    const showSkinMenu = Boolean(skinEl);
    const showSkinMenus = (event: React.MouseEvent<HTMLElement>) => {
        setSkinEl(event.currentTarget);
    };
    const handleMenuItemClick = (code: string) => {
        setSkinEl(null);
        handleClick(code);
    };
    return (<div className={styles.menu}>
            <Button
                aria-haspopup="true"
                aria-expanded={showSkinMenu ? 'true' : undefined}
                onClick={showSkinMenus}
                variant="outlined"
            >
                {title}
            </Button>
            <Menu
                anchorEl={skinEl}
                open={showSkinMenu}
                onClose={handleMenuItemClick}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {
                    menus.map((menu)=>{
                        return (<MenuItem onClick={()=>{handleMenuItemClick(menu.code)}}>{menu.title}</MenuItem>)
                    })
                }
            </Menu>
        </div>)
}

export default PopMenu;