const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>
            <p className='py-4 text-center text-sm md:text-base text-gray-500/80'>Copyright {currentYear} © - HR News & Articles. All rights reserved.</p>
        </div>
    )
}

export default Footer