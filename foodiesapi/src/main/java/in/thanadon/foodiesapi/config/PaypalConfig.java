package in.thanadon.foodiesapi.config;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class PaypalConfig {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public Map<String, String> payPalSDKConfig() {
        return Map.of("mode", mode);
    }

    @Bean
    public OAuthTokenCredential oAuthTokenCredential() {
        return new OAuthTokenCredential(clientId, clientSecret, payPalSDKConfig());
    }

    @Bean
    public APIContext apiContext(OAuthTokenCredential credential) {
        try {
            APIContext context = new APIContext(credential.getAccessToken());
            context.setConfigurationMap(payPalSDKConfig());
            return context;
        } catch (PayPalRESTException e) {
            throw new RuntimeException("Failed to initialize PayPal API context", e);
        }
    }
}

