from django.contrib.auth.views import LoginView
from .forms import AlFirdausLoginForm


class AlFirdausLoginView(LoginView):
    template_name = "dashboard/login.html"
    authentication_form = AlFirdausLoginForm
    redirect_authenticated_user = True

    def form_valid(self, form):
        response = super().form_valid(form)
        if form.cleaned_data.get("remember_me"):
            # Session persists for SESSION_COOKIE_AGE (default 2 weeks)
            self.request.session.set_expiry(1209600)
        else:
            # Session ends when the browser closes
            self.request.session.set_expiry(0)
        return response