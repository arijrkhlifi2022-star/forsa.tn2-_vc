from django.urls import path
from .views import OrderCreateView, MyOrdersListView

urlpatterns = [
    path('', OrderCreateView.as_view(), name='order_create'),
    path('my-orders/', MyOrdersListView.as_view(), name='my_orders'),
]