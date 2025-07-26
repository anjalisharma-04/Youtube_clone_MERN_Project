//frontend/src/routes/Routing.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../Redux/store.js';
import App from '../App';
// Importing components for different routes
import { Home, Dashboard, Playlist, EditAccount, EditChannel, Signup, Login, Settings, Shorts, Video, UploadVideo, AllVideo, AuthLayout, Channel,UpdateVideo } from '../components';

// Routing Component
function Routing() {
    return (
        // Wrapping the app with the Redux store provider to provide global state management
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App />}>
                        <Route index element={<Home />} />

                        <Route path='your_channel/*' element={
                            <AuthLayout>
                                <Dashboard />
                            </AuthLayout>
                        }>
                            <Route index element={
                                <AuthLayout>
                                    <AllVideo />
                                </AuthLayout>
                            } />
                            <Route path='upload_video' element={
                                <AuthLayout>
                                    <UploadVideo />
                                </AuthLayout>
                            } />
                             <Route path="update/:id" element={
                                <AuthLayout>
                                <UpdateVideo />
                                </AuthLayout>
                              } /> 
                        </Route>

                        <Route path='history' element={
                            <AuthLayout>
                                <Home />
                            </AuthLayout>
                        } />
                        <Route path='playlist' element={
                            <AuthLayout>
                                <  Playlist />
                            </AuthLayout>
                        } />
                        
                        <Route path='shorts' element={
                            <AuthLayout>
                                <Shorts />
                            </AuthLayout>
                        } />

                        <Route path='Channel/:id' element={
                                <Channel />
                        } />

                        <Route path='watch/:id' element={
                            <Video />
                        } />
                        <Route path='EditAccount' element={
                            <AuthLayout>
                                <EditAccount />
                            </AuthLayout>
                        } />

                        <Route path='edit_channel' element={
                            <AuthLayout>
                                < EditChannel />
                            </AuthLayout>
                        } />
                        <Route path='settings' element={
                            <AuthLayout>
                                < Settings />
                            </AuthLayout>
                        } />
                    </Route>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default Routing;