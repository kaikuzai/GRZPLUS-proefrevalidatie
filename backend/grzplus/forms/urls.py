# users/urls.py
from django.urls import path
from .views import FormIDDetailView, SubmitFormView, FormListView, FormIconView, FormSlugDetailView, SubmittedFormListView

# path('csrf-cookie/', GetCSRFToken.as_view(), name='csrf-cookie'), 
urlpatterns = [
    path('by-id/<int:form_id>/', FormIDDetailView.as_view(), name='form-detail-view'),
    path('by-slug/<str:form_slug>/', FormSlugDetailView.as_view(), name='form-detail-view'),
    path('submit/', SubmitFormView.as_view(), name='submit-form'),
    path('all-forms/', FormListView.as_view(), name='form-list'),
    path('form-icons/', FormIconView.as_view(), name='form-list-icon'),
    path('submitted/', SubmittedFormListView.as_view(), name='form-list-icon'),
]