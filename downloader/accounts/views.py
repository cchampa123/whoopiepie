from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.views import View
from django.conf import settings
from urllib.parse import parse_qs
from django.contrib.auth.views import SuccessURLAllowedHostsMixin
from two_factor.views import LoginView, SetupView
from two_factor.forms import TOTPDeviceForm
import django_otp
# Create your views here.
class ForceSetupBeforeLogin(LoginView):
    def done(self, *args, **kwargs):
        device = getattr(self.get_user(), 'otp_device', None)
        if device:
            return super().done(*args, **kwargs)
        else:
            login(self.request, self.get_user())
            return redirect('{}/?{}'.format(
                settings.SETUPVIEW,
                self.request.META['QUERY_STRING']
                ))

class InlineSetupView(SetupView):

    def done(self, form_list, **kwargs):
        """
        Finish the wizard. Save all forms and redirect.
        """
        # Remove secret key used for QR code generation
        try:
            del self.request.session[self.session_key_name]
        except KeyError:
            pass

        # TOTPDeviceForm
        if self.get_method() == 'generator':
            form = [form for form in form_list if isinstance(form, TOTPDeviceForm)][0]
            device = form.save()

        # PhoneNumberForm / YubiKeyDeviceForm
        elif self.get_method() in ('call', 'sms', 'yubikey'):
            device = self.get_device()
            device.save()

        else:
            raise NotImplementedError("Unknown method '%s'" % self.get_method())

        django_otp.login(self.request, device)
        parsed = parse_qs(self.request.META['QUERY_STRING'])
        redirect_url = parsed['next'][0]
        return redirect(redirect_url)

class RedirectSetupCompleteView(View):

    def get(self, request):
        full_string = request.META['QUERY_STRING']
        redirect_url = full_string[5:]
        return redirect(redirect_url)
