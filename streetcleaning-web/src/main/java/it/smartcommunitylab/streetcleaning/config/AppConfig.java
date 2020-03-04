/**
 *    Copyright 2015 Fondazione Bruno Kessler - Trento RISE
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package it.smartcommunitylab.streetcleaning.config;

import java.io.IOException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.xml.parsers.ParserConfigurationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.xml.sax.SAXException;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

import it.smartcommunitylab.streetcleaning.bean.CalendarDataBean;
import it.smartcommunitylab.streetcleaning.bean.StreetBean;
import it.smartcommunitylab.streetcleaning.common.Utils;
import it.smartcommunitylab.streetcleaning.model.Version;
import it.smartcommunitylab.streetcleaning.storage.RepositoryManager;

@Configuration
@ComponentScan("it.smartcommunitylab.streetcleaning")
@PropertySource("classpath:streetcleaning.properties")
@EnableWebMvc
@EnableAsync
@EnableScheduling
public class AppConfig extends WebMvcConfigurerAdapter {

	private static final transient Logger logger = LoggerFactory.getLogger(AppConfig.class);

	@Autowired
	@Value("${db.name}")
	private String dbName;

	@Autowired
	@Value("${defaultLang}")
	private String defaultLang;

	@Autowired
	@Value("${streetcleaning.kmlfile.name}")
	private String kmlFileName;

	@Autowired
	@Value("${streetcleaning.calfile.name}")
	private String calFileName;

	@Autowired
	@Value("${streetcleaning.updatefiles}")
	private String readFileOnLoad;

	public AppConfig() {
	}

	@Bean
	public MongoTemplate getMongo() throws UnknownHostException, MongoException {
		return new MongoTemplate(new MongoClient(), dbName);
	}

	@Bean
	RepositoryManager getRepositoryManager() throws UnknownHostException, MongoException {
		return new RepositoryManager(getMongo(), defaultLang);
	}

	@Bean
	public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
		return new PropertySourcesPlaceholderConfigurer();
	}

	@Bean
	public ViewResolver getViewResolver() {
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setPrefix("/resources/");
		resolver.setSuffix(".jsp");
		return resolver;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/apps/**").addResourceLocations("/apps/");
		registry.addResourceHandler("/resources/*").addResourceLocations("/resources/");
		registry.addResourceHandler("/css/**").addResourceLocations("/resources/css/");
		registry.addResourceHandler("/fonts/**").addResourceLocations("/resources/fonts/");
		registry.addResourceHandler("/js/**").addResourceLocations("/resources/js/");
		registry.addResourceHandler("/lib/**").addResourceLocations("/resources/lib/");
		registry.addResourceHandler("/i18n/**").addResourceLocations("/resources/i18n/");
		registry.addResourceHandler("/templates/**").addResourceLocations("/resources/templates/");
		registry.addResourceHandler("/html/**").addResourceLocations("/resources/html/");
		registry.addResourceHandler("/file/**").addResourceLocations("/resources/file/");
	}

	@Bean
	public MultipartResolver multipartResolver() {
		return new CommonsMultipartResolver();
	}

	@PostConstruct
	public boolean LoadInithialFiles() {
		boolean loadedOk = true;
		if (!Boolean.TRUE.toString().equalsIgnoreCase(readFileOnLoad)) return true;
		try {
			RepositoryManager mongoRepo = getRepositoryManager();

			List<StreetBean> streets = Utils.readKmlFile(kmlFileName);
			for (StreetBean sb : streets) {
				try {
					if (!mongoRepo.existStreet(sb)) {
						mongoRepo.saveStreet(sb);

					}
				} catch (Exception e) {
					logger.error(e.getMessage());
				}
			}

			URL resource = getClass().getResource("/");
			String path = resource.getPath();
			List<StreetBean> streets2 = null;
			try {
				streets2 = mongoRepo.getAllStreet();
			} catch (Exception e1) {
				e1.printStackTrace();
			}

			List<CalendarDataBean> cleaningDays = Utils.readCalendarFile(calFileName, streets2);
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
