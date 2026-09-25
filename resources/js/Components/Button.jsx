import React, { forwardRef } from 'react';
import { Link } from '@inertiajs/react';

const variants = {
 primary: 'border-transparent bg-rust text-[#fff8ed] shadow-[0_6px_20px_-8px_#98482980] hover:bg-[#793a22]',
 glass: 'border-white/30 bg-white/10 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/20',
 secondary: 'border-[#c9b99e] bg-[#eee4d3] text-[#563d29] hover:border-[#a77b53] hover:bg-[#e4d3b8]',
};
const sizes = {
 default: 'min-h-13 px-6 py-3 text-[13px]',
 compact: 'min-h-11 px-4 py-2 text-xs',
 large: 'min-h-14 px-8 py-3.5 text-sm sm:min-h-15 sm:px-9',
 icon: 'size-11 shrink-0 p-0',
};

const Button = forwardRef(function Button({ href, navigate = false, variant = 'primary', size = 'default', className = '', children, type = 'button', ...props }, ref) {
 const Component = href ? (navigate ? Link : 'a') : 'button';
 return <Component ref={ref} {...(href ? { href } : { type })} {...props} className={`gn-button inline-flex items-center justify-center gap-2.5 rounded-full border font-semibold leading-normal motion-safe:transition-[background-color,border-color,box-shadow,transform] motion-safe:duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dfba83] disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}>{children}</Component>;
});
export default Button;
