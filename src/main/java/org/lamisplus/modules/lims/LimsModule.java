package org.lamisplus.modules.lims;

import com.foreach.across.AcrossApplicationRunner;
import com.foreach.across.config.AcrossApplication;
import com.foreach.across.core.AcrossModule;
import com.foreach.across.core.context.configurer.ComponentScanConfigurer;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;
import com.foreach.across.modules.web.AcrossWebModule;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseModule;
import org.springframework.context.annotation.Bean;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@AcrossApplication(
		modules = {
				AcrossHibernateJpaModule.NAME,
				//AcrossWebModule.NAME
		})
@Slf4j
@EnableSwagger2
public class LimsModule extends AcrossModule {
	public static final String NAME = "LimsModule";

	public String getName() {
		return NAME;
	}

	public LimsModule() {
		super ();
		addApplicationContextConfigurer (new ComponentScanConfigurer (
				getClass ().getPackage ().getName () + ".domain",
				getClass ().getPackage ().getName () + ".repository",
				getClass ().getPackage ().getName () + ".config",
				getClass ().getPackage ().getName () + ".service",
				getClass ().getPackage ().getName () + ".controller",
				getClass ().getPackage ().getName () + ".util",
				"org.lamisplus.modules.patient.service",
				"org.lamisplus.modules.base.service"));
	}
}
