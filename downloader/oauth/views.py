from oauth2_provider.views import AuthorizationView
from two_factor.views.mixins import OTPRequiredMixin

# Create your views here.
class ProtectedAuthorizationView(OTPRequiredMixin, AuthorizationView):
    pass
