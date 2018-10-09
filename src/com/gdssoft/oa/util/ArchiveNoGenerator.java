package com.gdssoft.oa.util;
/*
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.system.DepartmentService;
*/
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.gdssoft.core.util.AppUtil;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.SnGeneratorService;

public class ArchiveNoGenerator {

	/**
	 * 表单分类-发文-工作联系单
	 */
	public static final int PUBLIC_ATCHIVE_TYPE_WORK_FORM = 101;
	/**
	 * 表单分类-发文-文件会签单
	 */
	public static final int PUBLIC_ATCHIVE_TYPE_FILE_JOINTLY_SIGN = 102;
	/**
	 * 表单分类-发文-文本评审表
	 */
	public static final int PUBLIC_ATCHIVE_TYPE_TEXT_REVIEW = 103;
	/**
	 * 表单分类-发文-提交经营班子会议议题及材料审批表
	 */
	public static final int PUBLIC_ATCHIVE_TYPE_JYBZH = 104;
	/**
	 * 表单分类-发文-红头文件
	 */
	public static final int PUBLIC_ATCHIVE_TYPE_REDHEAD = 105;
	
	
	/**
	 * 编号级别 - 公司级
	 */
	public static final int ATCHIVE_LEVEL_COMPANY = 201;
	/**
	 * 编号级别 - 部门级
	 */
	public static final int ATCHIVE_LEVEL_DEPARTMENT = 202;
	/**
	 * 编号级别 - 室级
	 */
	public static final int ATCHIVE_LEVEL_OFFICE = 203;
	

	/**
	 * 公司内发文
	 * @param type	类型，没有类型输入 0
	 * @param level	表单级别
	 * @param catalog 文本分类
	 * @param depId 部门编号
	 * @return
	 */ 
	public static String getArchiveNoInsidePublicFile(int type, int level, Long depId) {
		
		DepartmentService departmentService = (DepartmentService)AppUtil.getBean("departmentService");
		
		StringBuffer prefix = new StringBuffer();
		
		switch (type) {
			case PUBLIC_ATCHIVE_TYPE_WORK_FORM:
				prefix.append("W/");
				break;
			case PUBLIC_ATCHIVE_TYPE_FILE_JOINTLY_SIGN:
				prefix.append("F/");
				break;
			case PUBLIC_ATCHIVE_TYPE_TEXT_REVIEW:
				prefix.append("T/");
				break;
			case PUBLIC_ATCHIVE_TYPE_JYBZH:
				prefix.append("J/");
				break;
			case PUBLIC_ATCHIVE_TYPE_REDHEAD:
				prefix.append("R/");
				break;
			default:
				break;
		}
		
		Department department = departmentService.get(depId);
	
		Department officeDept = null;
		Department departmentDept = null;
		
		while (department.getParentId() > 0) {
			switch (department.getDepLevel().intValue()) {
				case 3:
					departmentDept = departmentService.get(department.getDepId());
					break;
				case 4:
					officeDept = departmentService.get(department.getDepId());
					break;
				default:
					break;
			}
			department = departmentService.get(department.getParentId());
			System.out.println(department.getDepLevel().intValue());
		}
		
		if (level == ATCHIVE_LEVEL_COMPANY) {
			prefix.append(department.getDepUnitCode()).append("/");
		}
		
		if (null != departmentDept && (level == ATCHIVE_LEVEL_DEPARTMENT || level == ATCHIVE_LEVEL_OFFICE)) {
			prefix.append(departmentDept.getDepUnitCode()).append("/");
		}
		
		if (null != officeDept && level == ATCHIVE_LEVEL_OFFICE) {
			prefix.append(officeDept.getDepUnitCode()).append("/");
		}
		
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-M");  
		prefix.append(dateFormat.format(date)).append("/");
		
		return getArchiveNo(prefix.toString(), "", 3);
	} 
	
	
	/**
	 * 取得红头文件编号
	 * 深地铁三运[yyyy]xxx号
	 * 深地铁三运函[yyyy]xxx号
	 * @param isLetter 是不是函
	 * @return
	 */ /*
	public static String getArchiveNoRedhead(boolean isLetter) {
		StringBuffer prefix = new StringBuffer();
		if (isLetter) {
			prefix.append("深地铁三运函[");
		} else {
			prefix.append("深地铁三运[");
		}
		
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("yyyy");  
		prefix.append(dateFormat.format(date)).append("]");
		
		return getArchiveNo(prefix.toString(), "]号", 3);
	}*/
	
	/**
	 * 运营公司发给总公司 MTR3/YYGS/yyyy-m/xxx
	 * @return
	 */ /*
	public static String getArchiveNoCompanyPublicFile() {
		StringBuffer prefix = new StringBuffer();
		prefix.append("MTR3").append("/");
		prefix.append("YYGS").append("/");
		
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-M");
		prefix.append(dateFormat.format(date)).append("/");
		
		return getArchiveNo(prefix.toString(), "", 3);
	}*/
	
	/**
	 * 收文分文件和会议通知
	 * 文件：行办/yyyy-m/xxx
	 * 会议通知：会/yyyy-m/xxx
	 * @param receiveType 收文类型
	 * @return
	 */ /*
	public static String getArchiveNoReceiveFile(int receiveType) {
		StringBuffer prefix = new StringBuffer();
		switch (receiveType) {
			case RECEIVE_ATCHIVE_TYPE_FILE:
				prefix.append("行办/");
				break;
			case RECEIVE_ATCHIVE_TYPE_MEETING:
				prefix.append("会/");
				break;
			default:
				break;
		}

		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-M");
		prefix.append(dateFormat.format(date)).append("/");
		
		return getArchiveNo(prefix.toString(), "", 3);
		
	}
	*/
	/**
	 * 根据前缀、后缀及序数长度，取得编号
	 * @param prefix 编号前缀
	 * @param suffix 编号后缀
	 * @param length 序数长度
	 */
	public static String getArchiveNo(String prefix, String suffix, int length) {
		SnGeneratorService snGeneratorService = (SnGeneratorService)AppUtil.getBean("snGeneratorService");
		return getArchiveNo(snGeneratorService, prefix, suffix, length);
	}
	/**
	 * 根据前缀、后缀及序数长度，取得编号
	 * @param snGeneratorService 编号生成器服务对象的实例
	 * @param prefix 编号前缀
	 * @param suffix 编号后缀
	 * @param length 序数长度
	 * @return
	 */
	public static String getArchiveNo(
			SnGeneratorService snGeneratorService, 
			String prefix, String suffix, int length) {
		SnGeneratorService generatorSNService = (SnGeneratorService)AppUtil.getBean("snGeneratorService");
		String sn = generatorSNService.nextSNByPrefix(prefix, suffix, length);
		return sn;
	}
}
