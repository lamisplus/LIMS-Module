package org.lamisplus.modules.lims.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "lims-pcr-lab",
        description = "Installs the required lims pcr labs",
        version = 1)
public class LimsPCRLabs extends AcrossLiquibaseInstaller {
    public LimsPCRLabs() {
        super("classpath:installers/lims/schema/schema2.xml");
    }
}