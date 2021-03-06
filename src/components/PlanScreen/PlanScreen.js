import React, { useEffect, useState } from 'react';
import "./PlanScreen.css";
import db from "../../firebase";
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { loadStripe } from "@stripe/stripe-js";

function PlanScreen() {
    const [products, setProducts] = useState();
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        db.collection('customers')
        .doc(user.uid)
        .collection('subscriptions')
        .get()
        .then(querySnapShot => {
            querySnapShot.forEach(async subscription => {
                setSubscription({
                    role: subscription.data().role,
                    current_period_end: subscription.data().current_period_end.seconds,
                    current_period_start: subscription.data().current_period_start,
                })
            })
        })
    },[user.uid])

    useEffect(() => {
        db.collection('products')
        .where("active", "==", true)
        .get().then(querySnapShot => {
            const products = {};
            querySnapShot.forEach(async productDoc => {
                products[productDoc.id] = productDoc.data();
                const priceSnap = await productDoc.ref.collection('prices').get();
                priceSnap.docs.forEach(price => {
                    products[productDoc.id].prices = {
                        priceId: price.id,
                        priceData: price.data()
                    }
                })
            }); 
            setProducts(products);
        });
    },[])
    const loadCheckOut = async (priceId) => {
        const docRef = await db.collection('customers')
            .doc(user.uid)
            .collection("checkout__sessions")
            .add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });
            docRef.onSnapshot(async (snap) => {
                const { error, sessionId } = snap.data();
                if(error){
                    //Show an error to the customer and inspect Cloud Function logs in firebase console.
                    alert('An error occured: ${error.message}');
                }
                if(sessionId){
                    //We have a session, let's redirect to Checkout Init Stripe
                    const stripe = await loadStripe('pk_test_51I5R4hK6FOwQJiDSfNKkLo0TQmdkAPOpWTJEVxIIwkFFZhK8JptL62sIq9KCXuKdyQnFGiGaZlrXKl4146EzuyBX00OmAVhDbd');
                    stripe.redirectToCheckout({ sessionId });
                }
            })
    };

    return (
        <div className="planScreen">
            {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
            {Object.entries(products).map(([productId, productData]) => {
                const isCurrenPackage = productData.name?.toLowerCase().includes(subscription?.role);
                return (
                    <div key={productId} className={`${isCurrenPackage && "planScreen__plan--disabled"} planScreen__plan`}>
                        <div className="planScreen__info">
                            <h5>{productData.name}</h5>
                            <h6>{productData.description}</h6>
                        </div>
                        <button onClick={() => loadCheckOut(productData.prices.priceId)}>
                            {isCurrenPackage ? 'Current Package' : 'Subscribe'}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default PlanScreen;
