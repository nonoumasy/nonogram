import React, {useState, useContext} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { UserContext } from '../../App' 
import Scroll from '../shared/Scroll'
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: { 
        flexGrow: 1,
    },
    headerOptions: {
    }
}));

const Navbar = props =>  {
    const [anchorEl, setAnchorEl] = useState(null);
    const { history } = props
    const classes = useStyles();
    const open = Boolean(anchorEl);
    const { state, dispatch } = useContext(UserContext)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (pageURL) => {
        history.push(pageURL)
        setAnchorEl(null);
    };

    const handleMenuLogout = () => {
        localStorage.clear()
        dispatch({ type: "CLEAR" })
        history.push('/login')
    }

    const isLoggedInMenu = [
        {
            id: 2,
            menuTitle: 'Add Post',
            handleClick: () => handleMenuClick('/create'),
        },
        {
            id: 3,
            menuTitle: 'Profile',
            handleClick: () => handleMenuClick('/profile'),
        },
        {
            id: 4,
            menuTitle: 'Following',
            handleClick: () => handleMenuClick('/myfollowingpost'),
        },
        {
            id: 5,
            menuTitle: 'Logout',
            handleClick: () => handleMenuLogout(),
        }
    ]

    const isLoggedOutMenu = [
        {
            id: 1,
            menuTitle: 'Login',
            handleClick: () => handleMenuClick('/login'),
        },
        {
            id: 2,
            menuTitle: 'Signup',
            handleClick: () => handleMenuClick('/signup'),
        }
    ]
    
    const menuItems = state ? isLoggedInMenu : isLoggedOutMenu

    const renderMenu = (Component = MenuItem) => menuItems.map(({ id, menuTitle, handleClick }) => (
        <Component key={id} onClick={handleClick}>
            {menuTitle}
        </Component>
    ))

    return (

        <div className={classes.root}>
            <Scroll showBelow={300} />
            <AppBar position="fixed" color='default' >
                <Toolbar>
                    <Typography className={classes.title}>
                        <Tooltip title="NONOGRAM" arrow placement="bottom">
                            <Link
                                href="/"
                                style={{ textDecoration: 'none' }}
                            >
                                ▲⚬▲⚬
                        </Link>
                        </Tooltip>
                    </Typography>
                
                    <div>
                        {isMobile ? (
                        <>
                            <IconButton 
                                edge="start" 
                                className={classes.menuButton} 
                                color="inherit" 
                                aria-label="menu"
                                onClick={handleMenu}>
                                <MenuIcon />
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                            >
                                {renderMenu()}
                            
                            </Menu>
                        </>
                        ) : (
                            <>
                                {renderMenu(Button)}
                            </>
                            
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </div>
    )
}  


export default withRouter(Navbar)
