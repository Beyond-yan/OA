package com.gdssoft.oa.util;

import java.io.IOException;
import java.rmi.RemoteException;

import javax.xml.rpc.ServiceException;

import cn.com.hnisi.egs.app.sms.client.SmsService;
import cn.com.hnisi.egs.app.sms.client.SmsServiceService;
import cn.com.hnisi.egs.app.sms.client.SmsServiceServiceLocator;
import cn.com.hnisi.egs.app.sms.client.model.RespInfo;

import com.gdssoft.core.util.PropertiesFileUtil;
import com.gdssoft.oa.model.communicate.SmsMobile;

public class SmsHelper {
	
	//private static Log logger = LogFactory.getLog(SmsHelper.class);
	
	private static SmsService sms = null;
	private static String passport = null;
	
	private static String serviceAddress = "http://10.224.2.177:6125/smsServer/services/SmsService";
	
	private static String spid = "501001";
	private static String psw = "000";
	private static String sendnum = "96096";
	private static String seqid = "106573018498";
	
	static {
		// String sn = "106573018498";此为固定值
		//SysConfig sysConfig1 = sysConfigDao.findDataValueByTkCkey("smsServiceConfig", "sn");
		seqid = PropertiesFileUtil.readValue("SmsHelper.seqId");
		
		//SysConfig sysConfig2 = sysConfigDao.findDataValueByTkCkey("smsServiceConfig", "endpointURL");
		serviceAddress = PropertiesFileUtil.readValue("SmsHelper.serviceServer")+"/smsServer/services/SmsService";
		
		//SysConfig sysConfig3 = sysConfigDao.findDataValueByTkCkey("smsServiceConfig", "spid");
		spid = PropertiesFileUtil.readValue("SmsHelper.spId");
		
		//SysConfig sysConfig4 = sysConfigDao.findDataValueByTkCkey("smsServiceConfig", "psw");
		setPsw(PropertiesFileUtil.readValue("SmsHelper.psw"));
		
		//SysConfig sysConfig5 = sysConfigDao.findDataValueByTkCkey("smsServiceConfig", "sendnum");
		sendnum = PropertiesFileUtil.readValue("SmsHelper.sendNum");
	}	
	
	public static void setPsw(String psw0) {
		try {
			psw =  new String(new sun.misc.BASE64Decoder().decodeBuffer(psw0));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * -- 注销WS接口
	 */
	private static void setterminate() {
		try {
			sms.terminate(passport);
		} catch (RemoteException e) {
			e.printStackTrace();
		}
	}

	/**
	 * -- 授权
	 * @return
	 */
	private static int auth() {
		RespInfo info = null;
		try {
			info = sms.auth(spid,psw);	//输入授权用户名和密码
			if (info != null && info.getRespCode() == 0) {
				passport = info.getRespMessage();
				return 0;
			}
		} catch (RemoteException e) {
			e.printStackTrace();
		}

		return -1;
	}

	/**
	 * -- 短信发送方法,如果发送失败,则注销后重新授权再发送5次.
	 * @param phone    -- 短信接收号码(必须)
	 * @param sendnum   -- 发送号码(96096必须)
	 * @param msg  -- 短信内容
	 * @param time   -- 预发送时间.
	 * @param report   是否要求状态报告 false 否 true 是
	 * @return 成功返回0,失败-1
	 */
	private static int sendSms(String phone, String sendnum, String msg,
			String time, Boolean report) {
		int res = -1;
		if (sms == null) {
			SmsServiceService smsService = new SmsServiceServiceLocator(serviceAddress);
			try {
				sms = smsService.getSmsService();
			} catch (ServiceException e) {
				e.printStackTrace();
			}
		}
		
		if (sms != null) {
			int SIZE = 270;
			for (int i = 0,j = 0, len = msg.length(); i < len; ) {
				if (auth() == 0) {
					j = i + SIZE;
					try {
						res = sentAfterAuth( phone,  sendnum,  msg.substring(i, j>len?len:j),  time,  report);
						i = j;
					} catch (RemoteException e) {
						j -= SIZE;
						i -= SIZE;
						e.printStackTrace();
					}
					setterminate();
				}else{
					System.out.println("auth failure.");//retrying...
				}
			}
		}else{
			System.out.println("sms is null.");
		}
		
		
		return res;
	}

	private static int sentAfterAuth(String phone, String sendnum2,
			String msg, String time, Boolean report) throws RemoteException {
		int res = 0;
		RespInfo sendsms = sms.sendSms(passport, seqid, sendnum
				, phone.replace("，", ",").split(","), msg, time, report);
		if (sendsms.getRespCode() != 0) {
			System.out.println("sent failure:"+sendsms.getRespMessage());
		}
		res = sendsms.getRespCode();
		return res;
	}


	public static boolean sent(SmsMobile sm) {
		String phone = sm.getPhoneNumber();	//receivers
		String msg = sm.getSmsContent(); 	//短信内容 maxlength=100
		/*Date sentt = new Date();
		sentt.setMinutes(new Date().getMinutes()+3);
		System.out.println(sentt);
		String time = new SimpleDateFormat("yyyymmddhhMMss").format(sentt);//"20131217102511";//yyyymmddhhMMss
        */
		String time = null; //格式:yyyymmddhhMMss 空:及时发送
		
		return (0==sendSms(phone,sendnum,msg,time,false));
	}
	
	
	public static void main(String[] args){
		// rp:18523055943 wmm:18523973780
		int i = sendSms("18523973780","96096","从前有座山,山上有座庙,庙里有个老和尚和小和尚。老和尚在给小和尚讲故事，内容是从前有座山,山上有座庙,庙里有个老和尚和小和尚。老和尚在给小和尚讲故事，内容是从前有座山,山上有座庙,庙里有个老和尚和小和尚。老和尚在给小和尚讲故事，内容是从前有座山,山上有座庙,庙里有个老和尚和小和尚。老和尚在给小和尚讲故事，内容是从前有座山,山上有座庙,庙里有个老和尚和小和尚。老和尚在给小和尚讲故事，内容是...",null,false);
		System.out.println(i);
		
	}
	
	
}
