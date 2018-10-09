package com.gdssoft.oa.service.point;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import javax.jws.WebService;

/**
 * 
 * 待办集成
 * 
 * @author f7400185
 * 
 */
@WebService
public interface MyToDoListService {

	/**
	 * 
	 * 待办集成
	 * 
	 * @param empId
	 *            员工编号
	 * @param count
	 *            返回待办事项的条数，为0或不输入时返回所有
	 * @return
	 */
	public String getMyToDoListXML(String empId, String count);
	//public String getDoListXML(String empId, String count);
	
	/**
	 * CC集成
	 * 
	 * 
	 * @param empId
	 *            员工编号
	 * @param count
	 *            返回待办事项的条数，为0或不输入时返回所有
	 * @return
	 */
	public String getMyCCListXML(String empId, String count);
}
