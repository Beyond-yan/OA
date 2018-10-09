package com.gdssoft.oa.service.communicate.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.commons.lang.StringUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.xml.sax.InputSource;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.DateUtil;
import com.gdssoft.oa.dao.communicate.SmsMobileDao;
import com.gdssoft.oa.dao.system.SysConfigDao;
import com.gdssoft.oa.model.communicate.SmsHistory;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.communicate.SmsHistoryService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
import com.gdssoft.oa.util.SmsHelper;

public class SmsMobileServiceImpl extends BaseServiceImpl<SmsMobile> implements
		SmsMobileService {
	@Resource
	private AppUserService appUserService;

	@Resource
	private SmsMobileService smsMobileService;

	@Resource
	private SmsHistoryService smsHistoryService;
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;
	
	@Resource
	private SysConfigDao sysConfigDao;

	private SmsMobileDao dao;

	public SmsMobileServiceImpl(SmsMobileDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public void saveSms(String userIds, String content) {
		// 号码序列,用","分隔
		System.out.println("userIds1:"+userIds);
		if (StringUtils.isNotEmpty(userIds)) {
			String[] ids = userIds.split(",");
			for (String id : ids) {
				AppUser recipients = appUserService.get(new Long(id));

				SmsMobile smsMobile = new SmsMobile();
				smsMobile.setPhoneNumber(recipients.getMobile());
				smsMobile.setSendTime(new Date());
				smsMobile.setRecipients(recipients.getFullname());
				smsMobile.setRecipientsId(recipients);
				smsMobile.setSmsContent(content);
				smsMobile.setUserId(AppUser.SYSTEM_USER);
				smsMobile.setUserName("系统");
				smsMobile.setStatus(SmsMobile.STATUS_NOT_SENDED);
				System.out.println("recipients.getMobile:"+recipients.getMobile());
				smsMobileService.save(smsMobile);
				
			}
		}
	}

	@Override
	public void sendSms() {
		System.out.println("----------------sendSMS------------");
		// TODO Auto-generated method stub
		//List<SmsMobile> list = smsMobileService.getAll();
		Map<String,List<SmsMobile>> smsMobileMap = getAllSchemaSms();
		System.out.println("----------------sendSMS------------" + smsMobileMap.size());
		sendSchemaSms(smsMobileMap);
		//send(list);
	}
	
	public Map<String,List<SmsMobile>> getAllSchemaSms(){
		List<SysSchemaConfig> sysSchemaConfigList = sysSchemaConfigService.getDefaultSiteSchemas();
		if(null == sysSchemaConfigList || sysSchemaConfigList.size()<1)
			return null;
		Map<String,List<SmsMobile>> smsMobileMap =  new HashMap<String,List<SmsMobile>>();
		for(SysSchemaConfig  sysSchemaConfig : sysSchemaConfigList){
			String schemaCode  = sysSchemaConfig.getSchemaCode().toLowerCase();
			List<SmsMobile> resultList = dao.findSmsMobileBySchema(schemaCode);
			if(null != resultList && resultList.size() > 0)
				smsMobileMap.put(schemaCode, resultList);
		}
		return smsMobileMap;
	}
	
	private void sendSchemaSms(Map<String,List<SmsMobile>> smsMobileMap){
		if(null == smsMobileMap || smsMobileMap.size()<1) return;
		Iterator it = smsMobileMap.keySet().iterator();
		while(it.hasNext()){
			String schemaCode = it.next().toString();
			List<SmsMobile> smsList = smsMobileMap.get(schemaCode);
			sendSms(schemaCode,smsList);
		}
	}
	
	private void sendSms(String schemaCode, List<SmsMobile> smsList) {
		if (null == smsList || smsList.size() < 1)
			return;
		try {
			for (SmsMobile smsMobile : smsList) {
				if (SmsHelper.sent(smsMobile)) { 
					smsMobileService.updateSmsMobileStatus(schemaCode, smsMobile.getSmsId(), SmsMobile.STATUS_SENDED);
					smsMobileService.saveSmsMobileHis(schemaCode, smsMobile.getSmsId());
					smsMobileService.delSmsMobile(schemaCode, smsMobile.getSmsId());
				}
			}
		} catch (Exception e) {
			logger.error(e);
			e.printStackTrace();
		}
	}

	public void send(List<SmsMobile> list) {
		try {
			for (SmsMobile smsMobile : list) {
				if(SmsMobile.STATUS_SENDED.equals(smsMobile.getStatus())){
					smsMobileService.remove(smsMobile);
					System.out.println("----------------smsMobileService.remove(smsMobile)------------");
				}else{
					smsMobile.setStatus(SmsMobile.STATUS_SENDED);
					if(SmsHelper.sent(smsMobile)){					//hua 20131217
						smsMobileService.save(smsMobile);
						SmsHistory smsHistory = new SmsHistory();
						BeanUtil.copyNotNullProperties(smsHistory, smsMobile);
						smsHistory.setSmsId(null);
						smsHistoryService.save(smsHistory);
					}
				}
			}
		} catch (Exception e) {
			logger.error(e);
			e.printStackTrace();
		}
	}

	@Override
	public List<SmsMobile> getNeedToSend() {
		return dao.getNeedToSend();
	}

	@Override
	public void sendOneSms(SmsMobile smsMobile) {
		String sendState = "";

		try {
			String sendDateTime = DateUtil
					.formatEnDate(smsMobile.getSendTime());
			String msgid = insertDownSmsMessage(smsMobile.getPhoneNumber(),
					smsMobile.getSmsContent(), sendDateTime);

			// 这里仅作为演示使用，通常发送完短信后无法立刻取得发送结果
			System.out.println("msgid:" + msgid);
			// 这支程式执行到下面会因无法根据msgid取得短信而报反馈结果不能解析的异常
			// 在实际使用中建议把发送和取得结果的过程分开

			/*
			 * if (!"".equals(msgid)) { sendState =
			 * getSmsMessageStatusByMsgId(msgid); }
			 */
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/**
	 * 
	 * @param telno
	 *            接收短信的手机号码
	 * @param content
	 *            短信内容
	 * @param sendtime
	 *            发送时间，为空则及时发送
	 * @return 信息唯一标示，获取状态时要用到
	 */
	private String insertDownSmsMessage(String telno, String content,
			String sendtime) throws Exception {

		// 此为固定值
		// String sn = "106573018498";
		SysConfig sysConfig1 = sysConfigDao.findDataValueByTkCkey(
				"smsServiceConfig", "sn");
		String sn = sysConfig1.getDataValue();

		SysConfig sysConfig2 = sysConfigDao.findDataValueByTkCkey(
				"smsServiceConfig", "endpointURL");
		String endpointURL = sysConfig2.getDataValue();

		SysConfig sysConfig3 = sysConfigDao.findDataValueByTkCkey(
				"smsServiceConfig", "orgaddr");
		String orgaddr = sysConfig3.getDataValue();
		// service url。
		// String endpointURL = "http://10.160.8.205/services/Sms";
		// String endpointURL = "http://njqyu.gicp.net/services/Sms";

		// 以上两个参数须配置在sys_config表中

		String msgid = ""; // 信息唯一标示
		String message = ""; // service调用失败时的说明信息

		String ret = "";
		Service service = new Service();

		try {
			Call call = (Call) service.createCall();
			call.setTargetEndpointAddress(new java.net.URL(endpointURL));
			// 设置操作的名称。
			call.setOperationName("InsertDownSms");
			// 执行调用
			ret = (String) call.invoke(new Object[] { sn, orgaddr, telno,
					content, sendtime });
		} catch (Exception e) {
			e.printStackTrace();
		}

		Document myDoc = getXmlDocument(ret);
		if (myDoc != null) {
			Element root = myDoc.getRootElement();
			try {
				Element head = (Element) root.getChildren("head").get(0);
				String code = ((Element) head.getChildren("code").get(0))
						.getText();
				if ("0".equals(code)) {
					Element body = (Element) root.getChildren("body").get(0);
					msgid = ((Element) body.getChildren("msgid").get(0))
							.getText();
				} else {
					message = ((Element) head.getChildren("message").get(0))
							.getText();
				}
			} catch (Exception e) {
				throw new Exception("返回的数据格式无法正确解析！");
			}
		} else {
			throw new Exception("返回的数据格式无法正确解析！");
		}

		if (!"".equals(message)) {
			throw new Exception(message);
		} else {
			return msgid;
		}
	}

	/**
	 * 
	 * @param msgid
	 *            信息唯一标示
	 * @return 发送状态，0@开头则表示发送成功，后面接的是发送完成的时间
	 * @throws Exception
	 */
	private String getSmsMessageStatusByMsgId(String msgid) throws Exception {

		// 此为固定值
		String sn = "106573018498";
		// service url。
		String endpointURL = "http://10.160.8.205/services/Sms";
		// String endpointURL = "http://njqyu.gicp.net/services/Sms";

		// 以上两个参数须配置在sys_config表中

		String message = ""; // service调用失败时的说明信息
		String status = ""; // 状态，0是成功，其他失败
		String resultmsg = ""; // 结果说明
		String donetime = ""; // 发送完成的时间

		String ret = "";
		Service service = new Service();

		try {
			Call call = (Call) service.createCall();
			call.setTargetEndpointAddress(new java.net.URL(endpointURL));
			// 设置操作的名称。
			call.setOperationName("getSpecialDownSmsResult");
			// 执行调用
			ret = (String) call.invoke(new Object[] { sn, msgid });
		} catch (Exception e) {
			e.printStackTrace();
		}

		Document myDoc = getXmlDocument(ret);
		if (myDoc != null) {
			Element root = myDoc.getRootElement();
			try {
				Element head = (Element) root.getChildren("head").get(0);
				String code = ((Element) head.getChildren("code").get(0))
						.getText();
				if ("0".equals(code)) {
					Element body = (Element) root.getChildren("body").get(0);
					status = ((Element) body.getChildren("status").get(0))
							.getText();
					resultmsg = ((Element) body.getChildren("resultmsg").get(0))
							.getText();
					donetime = ((Element) body.getChildren("donetime").get(0))
							.getText();
				} else {
					message = ((Element) head.getChildren("message").get(0))
							.getText();
				}
			} catch (Exception e) {
				throw new Exception("返回的数据格式无法正确解析！");
			}
		} else {
			throw new Exception("返回的数据格式无法正确解析！");
		}

		if (!"".equals(message)) {
			throw new Exception(message);
		} else {
			if ("0".equals(status)) {
				// 代表成功
				return "0:" + donetime;
			} else {
				return resultmsg;
			}
		}
	}

	private Document getXmlDocument(String strxml) {
		Document myDoc = null;
		SAXBuilder sb = new SAXBuilder();
		StringReader xmlString = new StringReader(strxml);
		InputSource source = new InputSource(xmlString);

		try {
			myDoc = sb.build(source);
		} catch (JDOMException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return myDoc;
	}
	
	public List<SmsMobile> findByDepAndTeam(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId){
		List<SmsMobile> list = dao.findByDepAndTeam(depId, teamId, start, size, sendTime, recipients, phoneNumber, userId);
		return list;
	}
	
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId){
		return dao.count(depId, teamId, sendTime, recipients, phoneNumber, userId);
	}
	/**
	 * 
	 * @param schemaCode
	 * @return
	 */
	public List<SmsMobile> findSmsMobileBySchema(String schemaCode){
		List<SmsMobile> resultList =  new ArrayList<SmsMobile>();
		return resultList;
	}
	public void updateSmsMobileStatus(String schemaCode,long smsId,int status){
		dao.updateSmsMobileStatus(schemaCode, smsId, status);
	}
	public void saveSmsMobileHis(String schemaCode,long smsId){
		dao.saveSmsMobileHis(schemaCode, smsId);
	}
	public void delSmsMobile(String schemaCode,long smsId){
		dao.delSmsMobile(schemaCode, smsId);
	}
	
	@Override
	public void saveSms(String schemaCode, String userIds, String content) {
		// 号码序列,用","分隔
		System.out.println("userIds1:"+userIds);
		if (StringUtils.isNotEmpty(userIds)) {
			String[] ids = userIds.split(",");
			for (String id : ids) {
				AppUser recipients = appUserService.get(new Long(id));

				SmsMobile smsMobile = new SmsMobile();
				smsMobile.setPhoneNumber(recipients.getMobile());
				smsMobile.setSendTime(new Date());
				smsMobile.setRecipients(recipients.getFullname());
				smsMobile.setRecipientsId(recipients);
				smsMobile.setSmsContent(content);
				smsMobile.setUserId(AppUser.SYSTEM_USER);
				smsMobile.setUserName("系统");
				smsMobile.setStatus(SmsMobile.STATUS_NOT_SENDED);
				System.out.println("recipients.getMobile:"+recipients.getMobile());
				dao.saveSmsMobile(schemaCode, smsMobile);
				
			}
		}
	}
}