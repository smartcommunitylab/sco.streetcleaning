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

package it.smartcommunitylab.streetcleaning.controller;

import it.smartcommunitylab.streetcleaning.common.Utils;
import it.smartcommunitylab.streetcleaning.exception.UnauthorizedException;
import it.smartcommunitylab.streetcleaning.security.DataSetInfo;
import it.smartcommunitylab.streetcleaning.storage.DataSetSetup;
import it.smartcommunitylab.streetcleaning.storage.RepositoryManager;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@Controller
public class AdminController {
	private static final transient Logger logger = LoggerFactory.getLogger(AdminController.class);
			
	@Autowired
	private RepositoryManager storage;

	@Autowired
	private DataSetSetup dataSetSetup;
	
	/*@RequestMapping(method = RequestMethod.GET, value = "/ping")
	public @ResponseBody
	String ping(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		return "PONG";
	}*/
	
	@RequestMapping(value = "/dataset/{ownerId}", method = RequestMethod.POST)
	public @ResponseBody String updateDataSetInfo(@RequestBody DataSetInfo dataSetInfo, 
			@PathVariable String ownerId, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		storage.saveAppToken(dataSetInfo.getOwnerId(), dataSetInfo.getToken());
		storage.saveDataSetInfo(dataSetInfo);
		dataSetSetup.init();
		if(logger.isInfoEnabled()) {
			logger.info("add dataSet");
		}
		return "OK";
	}
	
	@RequestMapping(value = "/reload/{ownerId}", method = RequestMethod.GET)
	public @ResponseBody String reload(@PathVariable String ownerId, 
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(!Utils.validateAPIRequest(request, dataSetSetup, storage)) {
			throw new UnauthorizedException("Unauthorized Exception: token not valid");
		}
		dataSetSetup.init();
		if(logger.isInfoEnabled()) {
			logger.info("reload dataSet");
		}
		return "OK";
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public Map<String,String> handleError(HttpServletRequest request, Exception exception) {
		return Utils.handleError(exception);
	}
	
}
