package com.gdssoft.oa.action.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import javax.annotation.Resource;
import com.gdssoft.oa.service.system.SnGeneratorService;
import com.gdssoft.oa.util.ArchiveNoGenerator;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;

import flexjson.JSONSerializer;


/**
 * 
 * @author jimxu
 *
 */
public class SnGeneratorAction extends BaseAction{

	@Resource
	private SnGeneratorService snGeneratorService;

	private Map<String,String> receiveFileTypeMap = new HashMap<String,String>();
	
	public SnGeneratorAction() {
		super();
		
		receiveFileTypeMap.put("文件", "行办");
		receiveFileTypeMap.put("会议通知", "会");
		
	}
	
	/**
	 * 通用方法
	 * 根据前缀、后缀及序数长度，取得编号
	 * @return
	 */
	public String getArchiveNo() {

		String prefix = getRequest().getParameter("prefix");
		String suffix = getRequest().getParameter("suffix");
		String lengthString = getRequest().getParameter("length");
		int length = 3;
		if (StringUtil.isNum(lengthString)) {
			length = Integer.parseInt(lengthString);
		}
		return ArchiveNoGenerator.getArchiveNo(snGeneratorService, prefix, suffix, length);
	
	}
	
	/**
	 * 取收文类别列表
	 * @return
	 */
	public String getReceiveFileTypeList() {
		
		StringBuffer buffer = new StringBuffer("[");
		Set<String> set = receiveFileTypeMap.keySet();
		if (set.size() > 0) {
			JSONSerializer json = JsonUtil.getJSONSerializer("text");
			buffer.append(json.serialize(set));
		}
		buffer.append("]");
		setJsonString(buffer.toString().replaceAll(",", "],["));
		return SUCCESS;
	}
	
	/**
	 * 取收文编号
	 * @return
	 */
	public String getReceiveFile() {
		StringBuffer result = new StringBuffer();
		result.append("{").append("success:true");
		String receiveFileType = getRequest().getParameter("receiveFileType");
		if (null != receiveFileType && !"".equals(receiveFileType)) {
			
			StringBuffer prefix = new StringBuffer();
			prefix.append(receiveFileTypeMap.get(receiveFileType));
			prefix.append("/");

			Date date = new Date();
			DateFormat dateFormat = new SimpleDateFormat("yyyy-M");
			prefix.append(dateFormat.format(date)).append("/");
			
			String sn = ArchiveNoGenerator.getArchiveNo(prefix.toString(), "", 3);
			
			if (null != sn && !"".equals(sn)) {
				result.append(",sn:\"").append(sn);
			}
		}
		result.append("\"}");
		setJsonString(result.toString());
		return SUCCESS;
	}
	
	/**
	 * 运营公司发给总公司 MTR3/YYGS/yyyy-m/xxx
	 * @return
	 */
	public String getArchiveNoCompanyPublicFile() {
		StringBuffer prefix = new StringBuffer();
		prefix.append("MTR3").append("/");
		prefix.append("YYGS").append("/");
		
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-M");
		prefix.append(dateFormat.format(date)).append("/");
		
		return ArchiveNoGenerator.getArchiveNo(prefix.toString(), "", 3);
	}
	
}
