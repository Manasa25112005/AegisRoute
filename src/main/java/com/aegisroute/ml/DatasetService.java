package com.aegisroute.ml;

import com.aegisroute.entity.Gateway;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
public class DatasetService {

    private static final String FILE_NAME = "gateway_dataset.csv";

    public void saveGatewayData(List<Gateway> gateways, Gateway selectedGateway) {

        try {

            File file = new File(FILE_NAME);
            boolean newFile = file.createNewFile();

            FileWriter writer = new FileWriter(file, true);

            if (newFile) {
                writer.write("GatewayName,ResponseTime,FailureCount,Cost,CircuitOpen,Status,Selected\n");
            }

            for (Gateway gateway : gateways) {

                int selected = gateway.getId().equals(selectedGateway.getId()) ? 1 : 0;

                writer.write(
                        gateway.getGatewayName() + "," +
                                gateway.getResponseTime() + "," +
                                gateway.getFailureCount() + "," +
                                gateway.getCost() + "," +
                                (gateway.isCircuitOpen() ? 1 : 0) + "," +
                                gateway.getStatus() + "," +
                                selected + "\n"
                );
            }

            writer.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}