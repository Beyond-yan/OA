package com.gdssoft.oa.job;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.oa.model.admin.CarDriver;

/**
 * 
 *导入的水电明细存放在内存中
 * 
 * @author f7400185
 * 
 */
public class ParamMap {
	private static Log logger = LogFactory.getLog(ParamMap.class);

	public static Map<String, List<CarDriver>> carDriverMap=new HashMap<String, List<CarDriver>>();

	public static Map<String, List<CarDriver>> getCarDriverMap() {
		return carDriverMap;
	}

	public static void setCarDriverMap(Map<String, List<CarDriver>> carDriverMap) {
		ParamMap.carDriverMap = carDriverMap;
	}

}