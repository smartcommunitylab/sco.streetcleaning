package it.smartcommunitylab.streetcleaning.config;

import java.io.IOException;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;


import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.common.Utils;
import it.smartcommunitylab.streetcleaning.storage.RepositoryManager;
import jakarta.annotation.PostConstruct;

@Component
public class AppInitializer {

	private static final transient Logger logger = LoggerFactory.getLogger(AppInitializer.class);

	@Autowired
	@Value("${streetcleaning.kmlfile}")
	private Resource kmlFile;

	@Autowired
	@Value("${streetcleaning.calfile}")
	private Resource calFile;

	@Autowired
	@Value("${streetcleaning.updatefiles}")
	private String readFileOnLoad;

	@Autowired
	private RepositoryManager mongoRepo;

	@PostConstruct
	public boolean loadInithialFiles() {
		boolean loadedOk = true;
		if (!Boolean.TRUE.toString().equalsIgnoreCase(readFileOnLoad)) return true;
		try {

			List<StreetBean> streets = Utils.readKmlFile(kmlFile.getInputStream());
			for (StreetBean sb : streets) {
				try {
					if (!mongoRepo.existStreet(sb)) {
						mongoRepo.saveStreet(sb);

					}
				} catch (Exception e) {
					logger.error(e.getMessage());
				}
			}

			List<StreetBean> streets2 = null;
			try {
				streets2 = mongoRepo.getAllStreet();
			} catch (Exception e1) {
				e1.printStackTrace();
			}

			mongoRepo.cleanCalendars();
			List<CalendarDataBean> cleaningDays = Utils.readCalendarFile(calFile.getInputStream(), streets2);
			for (CalendarDataBean cb : cleaningDays) {
				try {
					mongoRepo.saveCalendar(cb);
				} catch (Exception e) {
					logger.error(e.getMessage());
				}
			}

		} catch (ParserConfigurationException | SAXException | IOException e) {
			loadedOk = false;
			logger.error(e.getMessage());
		} catch (Exception e2) {
			loadedOk = false;
			e2.printStackTrace();
		}
		return loadedOk;
	}
}
