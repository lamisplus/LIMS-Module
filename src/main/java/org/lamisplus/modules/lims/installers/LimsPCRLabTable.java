package org.lamisplus.modules.lims.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;
@Order(1)
@Installer(name = "lims-pcr-lab tables",
        description = "Installs the required lims pcr labs tables",
        version = 1)
public class LimsPCRLabTable extends AcrossLiquibaseInstaller {
    public LimsPCRLabTable() {
        super("classpath:installers/lims/schema/schema3.xml");
    }
}