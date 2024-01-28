import { useState, useEffect } from 'react';
import './App.scss';

function App() {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(() => {
    // Load cart items from localStorage when the component mounts
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  })
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://teclead-ventures.github.io/data/london-events.json');
        if(!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const events = await response.json();
        const categorizedData = events.reduce((acc, event) => {
          (acc[event.date] = acc[event.date] || []).push(event);
          return acc;
        }, {});

        setData(categorizedData);
      } catch(error) {
        console.error("Could not fetch events: ", error);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart)
  }, [cart])

  const handleAddToCart = (eventToAdd) => {
    setCart(currentCart => {
      const isEventInCart = currentCart.find(event => event._id === eventToAdd._id);
      if(isEventInCart) {
        return currentCart;
      } else {
        return [...currentCart, eventToAdd];
      }
    })
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleCart = () => {
    setShowCart(!showCart);
  }

  const handleRemoveFromCart = (eventIdRemove) => {
    setCart(currentCart => currentCart.filter(event => event._id !== eventIdRemove))
  }

  return (
    <div>
      <header>
        <div className='header-box'>
          <div className='search-box'>
            <svg width="16" height="16" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M498.453 498.193L700 700M566.667 333.333C566.667 462.2 462.2 566.667 333.333 566.667C204.467 566.667 100 462.2 100 333.333C100 204.467 204.467 100 333.333 100C462.2 100 566.667 204.467 566.667 333.333Z" stroke="white" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type='text' 
              value={searchTerm}
              onChange={handleSearch}
              placeholder='Search...' 
            />
          </div>
          <svg width="16" height="16" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M100 153.333C100 134.665 100 125.331 103.633 118.2C106.829 111.928 111.928 106.829 118.2 103.633C125.331 100 134.665 100 153.333 100H646.667C665.337 100 674.67 100 681.8 103.633C688.073 106.829 693.17 111.928 696.367 118.2C700 125.331 700 134.665 700 153.333V211.242C700 219.395 700 223.471 699.08 227.308C698.263 230.709 696.917 233.96 695.087 236.943C693.027 240.307 690.143 243.189 684.38 248.954L482.287 451.047C476.523 456.81 473.64 459.693 471.58 463.057C469.75 466.04 468.403 469.29 467.587 472.693C466.667 476.53 466.667 480.607 466.667 488.757V566.667L333.333 700V488.757C333.333 480.607 333.333 476.53 332.412 472.693C331.596 469.29 330.249 466.04 328.421 463.057C326.36 459.693 323.477 456.81 317.712 451.047L115.621 248.954C109.856 243.189 106.973 240.307 104.912 236.943C103.084 233.96 101.738 230.709 100.921 227.308C100 223.471 100 219.395 100 211.242V153.333Z" stroke="white" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <button onClick={toggleCart} className='shopping-cart'>
          <svg width="24" height="24" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 166.667H609.227C634.82 166.667 650.867 194.316 638.17 216.538L552.527 366.41C540.66 387.18 518.57 400 494.647 400H266.667M266.667 400L215.209 482.333C201.333 504.533 217.294 533.333 243.475 533.333H600M266.667 400L135.093 136.852C123.8 114.267 100.716 100 75.4647 100H66.667M266.667 666.667C266.667 685.077 251.743 700 233.334 700C214.924 700 200 685.077 200 666.667C200 648.257 214.924 633.333 233.334 633.333C251.743 633.333 266.667 648.257 266.667 666.667ZM600 666.667C600 685.077 585.077 700 566.667 700C548.257 700 533.334 685.077 533.334 666.667C533.334 648.257 548.257 633.333 566.667 633.333C585.077 633.333 600 648.257 600 666.667Z" stroke="white" strokeWidth="66.6667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{cart.length}</span>
        </button>
      </header>

      <div className={`sidebar ${showCart ? 'open' : ''}`}>
        {cart.map(event => (
          <div className='sidebar-container'>
            <div>
              <img src={event.flyerFront} alt="" />
              <p>{event.title}</p>
            </div>
            <button onClick={() => handleRemoveFromCart(event._id)} className='sidebar-close'>
              <svg width="32" height="32" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M152.5 152.5C161.876 143.126 174.591 137.861 187.85 137.861C201.108 137.861 213.823 143.126 223.2 152.5L400 329.3L576.8 152.5C586.23 143.392 598.86 138.352 611.97 138.466C625.08 138.58 637.62 143.839 646.891 153.109C656.161 162.38 661.419 174.92 661.533 188.03C661.647 201.14 656.608 213.77 647.5 223.2L470.7 400L647.5 576.8C656.608 586.23 661.647 598.86 661.533 611.97C661.419 625.08 656.161 637.621 646.891 646.891C637.62 656.161 625.08 661.42 611.97 661.534C598.86 661.648 586.23 656.608 576.8 647.5L400 470.7L223.2 647.5C213.77 656.608 201.139 661.648 188.03 661.534C174.92 661.42 162.379 656.161 153.109 646.891C143.838 637.621 138.58 625.08 138.466 611.97C138.352 598.86 143.392 586.23 152.5 576.8L329.3 400L152.5 223.2C143.126 213.824 137.86 201.108 137.86 187.85C137.86 174.592 143.126 161.876 152.5 152.5Z" fill="#B50000"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <main>
        {/* Filters */}
        <div></div>

        <h1>Public Events</h1>

        <section>
          {Object.keys(data).map(dateCategory => {
            const eventDate = new Date(dateCategory);
            const dateString = eventDate.toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
            });
            const categoryEvents = data[dateCategory];
            const filteredEvents = categoryEvents.filter(event => (
              event.title.toLowerCase().includes(searchTerm.toLowerCase())
            ))

            if(filteredEvents.length === 0) return null;

            return (
              <article key={dateCategory}>
                <h2 className='event-categories'>{dateString}</h2>
                <div className='event-container'>
                  {filteredEvents.map(event => (
                    <div key={event._id} className='event-box'>
                      <div className='event-header'>
                        <p>{event.title}</p>
                      </div>
                      <img src={event.flyerFront} alt="" />
                      <div className='event-details'>
                        <a href={event.venue.direction} target='_blank' className='event-location'>
                          <svg width="16" height="16" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M642.5 287.25C639.169 225.345 614.014 166.621 571.5 121.5C525.988 76.0674 464.308 50.5503 400 50.5503C335.692 50.5503 274.012 76.0674 228.5 121.5C185.986 166.621 160.831 225.345 157.5 287.25C150.75 365.5 188 432.25 227 494C236.25 508.5 318 638.5 357.5 702.75C361.973 710.002 368.226 715.991 375.664 720.147C383.102 724.304 391.479 726.491 400 726.5C408.521 726.491 416.898 724.304 424.336 720.147C431.774 715.991 438.027 710.002 442.5 702.75C482 638.5 563.75 508.5 573 494C612 432.25 650 365.5 642.5 287.25Z" fill="#8C9EFF"/>
                            <path d="M442.5 702.75C482 638.5 563.75 508.5 573 494C612 432.25 648 365.5 642.5 287.25C639.169 225.345 614.014 166.621 571.5 121.5C549.067 98.8264 522.357 80.8312 492.918 68.5577C463.478 56.2841 431.895 49.9763 400 50.0001V725C408.381 725.151 416.666 723.193 424.093 719.305C431.519 715.417 437.849 709.724 442.5 702.75Z" fill="#5F7CF9"/>
                            <path d="M400 400C455.228 400 500 355.228 500 300C500 244.772 455.228 200 400 200C344.772 200 300 244.772 300 300C300 355.228 344.772 400 400 400Z" fill="#5F7CF9"/>
                            <path d="M500 300C500 273.478 489.464 248.043 470.711 229.289C451.957 210.536 426.522 200 400 200V400C426.522 400 451.957 389.464 470.711 370.711C489.464 351.957 500 326.522 500 300Z" fill="#4062ED"/>
                          </svg>
                          <span>{event.venue.name}</span>
                        </a>
                        <p>| Starts: {event.startTime}</p>
                        <p>| Ends: {event.endTime}</p>
                      </div>

                      <button onClick={() => handleAddToCart(event)} className='add-to-cart'>
                        <svg width="16" height="16" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_20_14)">
                          <path fillRule="evenodd" clipRule="evenodd" d="M700 300H500V100C500 44.75 455.225 0 400 0C344.775 0 300 44.75 300 100V300H100C44.775 300 0 344.75 0 400C0 455.25 44.775 500 100 500H300V700C300 755.25 344.775 800 400 800C455.225 800 500 755.25 500 700V500H700C755.225 500 800 455.25 800 400C800 344.75 755.225 300 700 300Z" fill="white"/>
                          </g>
                          <defs>
                          <clipPath id="clip0_20_14">
                          <rect width="800" height="800" fill="white"/>
                          </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  )
}

export default App
