package org.lamisplus.modules.lims.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "lims-insert-schema-installer",
        description = "Insert the required database tables data for lims",
        version = 1)
public class LimsInsertSchemaInstaller extends AcrossLiquibaseInstaller {
    public LimsInsertSchemaInstaller() {
        super("classpath:schema/lims-insert-schema-1.0.xml");
    }
}
